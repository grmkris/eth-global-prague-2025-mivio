'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { WalletClient } from 'viem';
import { keccak256, toHex, toBytes } from 'viem';
import { api } from '~/trpc/react';
import { getClearNodeClient, type WSStatus } from '~/services/nitrolite/clearNodeClient';

interface UseEventSessionOptions {
  walletAddress: `0x${string}` | undefined;
  walletClient: WalletClient | undefined;
}

interface SessionInfo {
  sessionId: string;
  status: 'open' | 'closed' | 'settling';
  participant: string;
  eventSlug: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

// Storage keys for this event
const getStorageKey = (eventSlug: string, key: string) => 
  `nitrolite_session_${eventSlug}_${key}`;

// Helper to create signed requests
const createSignedRequest = async (
  signer: (payload: unknown) => Promise<string>,
  method: string,
  params: unknown[] = []
): Promise<string> => {
  const requestId = Date.now();
  const timestamp = Math.floor(Date.now() / 1000);
  const requestData = [requestId, method, params, timestamp];
  const request = { req: requestData };
  
  // Sign the request
  const signature = await signer(request);
  
  request.sig = [signature];
  
  return JSON.stringify(request);
};

export function useEventSession(options: UseEventSessionOptions) {
  const { walletAddress, walletClient } = options;
  const params = useParams();
  const eventSlug = params?.eventSlug as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [offchainBalance, setOffchainBalance] = useState('0.00');
  const [connectionStatus, setConnectionStatus] = useState<WSStatus>('disconnected');
  
  const clearNodeClient = useRef(getClearNodeClient());
  const unsubscribeStatusRef = useRef<(() => void) | null>(null);
  const unsubscribeMessageRef = useRef<(() => void) | null>(null);

  // Check if user has joined the event
  const { data: participantStats } = api.event.getParticipantStats.useQuery(
    { eventSlug, walletAddress: walletAddress ?? '' as `0x${string}` },
    { enabled: !!eventSlug && !!walletAddress }
  );

  // Message signer for ClearNode requests
  const messageSigner = useCallback(async (payload: unknown) => {
    if (!walletClient || !walletClient.account) {
      throw new Error('Wallet not connected');
    }
    
    const message = JSON.stringify(payload);
    const digestHex = keccak256(toHex(message))
    const messageBytes = toBytes(digestHex)
    
    const signature = await walletClient.signMessage({
      account: walletClient.account,
      message: { raw: messageBytes },
    });
    
    return signature;
  }, [walletClient]);

  // Load saved session on mount
  useEffect(() => {
    if (!eventSlug) return;
    
    const savedSessionId = localStorage.getItem(getStorageKey(eventSlug, 'sessionId'));
    const savedSessionInfo = localStorage.getItem(getStorageKey(eventSlug, 'sessionInfo'));
    
    if (savedSessionId && savedSessionInfo) {
      try {
        const sessionData = JSON.parse(savedSessionInfo) as SessionInfo;
        setSessionInfo(sessionData);
        setIsSessionOpen(sessionData.status === 'open');
        setOffchainBalance(sessionData.balance || '0.00');
      } catch (err) {
        console.error('Failed to parse saved session info:', err);
      }
    }
  }, [eventSlug]);

  // Clear stored session data
  const clearStoredSession = useCallback(() => {
    if (!eventSlug) return;
    
    localStorage.removeItem(getStorageKey(eventSlug, 'sessionId'));
    localStorage.removeItem(getStorageKey(eventSlug, 'sessionInfo'));
    setSessionInfo(null);
    setIsSessionOpen(false);
    setOffchainBalance('0.00');
  }, [eventSlug]);

  // Connect to ClearNode
  const connectToClearNode = useCallback(async () => {
    if (!walletAddress || !walletClient || !eventSlug) {
      setError('Missing required parameters for connection');
      return;
    }

    setError(null);

    try {
      await clearNodeClient.current.connect({
        walletAddress,
        signerAddress: walletAddress,
        walletClient,
      });

      // Request session info after connection
      await requestSessionInfo();
    } catch (err) {
      console.error('Failed to connect to ClearNode:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to ClearNode');
    }
  }, [walletAddress, walletClient, eventSlug]);

  // Subscribe to ClearNode status and messages
  useEffect(() => {
    // Subscribe to status changes
    unsubscribeStatusRef.current = clearNodeClient.current.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    // Subscribe to messages
    // biome-ignore lint: life is hard
    unsubscribeMessageRef.current = clearNodeClient.current.onMessage((message: any) => {
      // Handle session-specific messages
      if (message.res && message.res[1] === 'get_sessions') {
        handleSessionsResponse(message.res[2]);
      } else if (message.res && message.res[1] === 'create_session') {
        handleCreateSessionResponse(message.res[2]);
      } else if (message.res && message.res[1] === 'get_session_balance') {
        handleBalanceResponse(message.res[2]);
      }
    });

    // Connect if we have the required params
    if (walletAddress && walletClient && eventSlug) {
      connectToClearNode();
    }

    // Cleanup on unmount
    return () => {
      if (unsubscribeStatusRef.current) {
        unsubscribeStatusRef.current();
      }
      if (unsubscribeMessageRef.current) {
        unsubscribeMessageRef.current();
      }
    };
  }, [walletAddress, walletClient, eventSlug, connectToClearNode]);

  // Request session information
  const requestSessionInfo = useCallback(async () => {
    if (!walletAddress || !clearNodeClient.current.isConnected) return;
    
    try {
      const request = await createSignedRequest(
        messageSigner,
        'get_sessions',
        [{
          event_slug: eventSlug,
          participant: walletAddress
        }]
      );
      
      await clearNodeClient.current.sendRequest(request);
    } catch (err) {
      console.error('Failed to request session info:', err);
    }
  }, [walletAddress, eventSlug, messageSigner]);

  // Handle sessions response
  // biome-ignore lint: life is hard
  const handleSessionsResponse = useCallback((data: any) => {
    if (!data || !Array.isArray(data)) return;
    
    const sessions = data[0];
    if (!sessions || sessions.length === 0) {
      console.log('No active sessions found for event');
      return;
    }
    
    // Find session for current event
    // biome-ignore lint: life is hard
    const eventSession = sessions.find((s: any) => s.event_slug === eventSlug);
    if (eventSession) {
      const sessionData: SessionInfo = {
        sessionId: eventSession.session_id,
        status: eventSession.status,
        participant: eventSession.participant,
        eventSlug: eventSession.event_slug,
        balance: eventSession.balance || '0.00',
        createdAt: eventSession.created_at,
        updatedAt: eventSession.updated_at,
      };
      
      setSessionInfo(sessionData);
      setIsSessionOpen(sessionData.status === 'open');
      setOffchainBalance(sessionData.balance);
      
      // Save to localStorage
      localStorage.setItem(getStorageKey(eventSlug, 'sessionId'), sessionData.sessionId);
      localStorage.setItem(getStorageKey(eventSlug, 'sessionInfo'), JSON.stringify(sessionData));
    }
  }, [eventSlug]);

  // Handle create session response
  // biome-ignore lint: life is hard
  const handleCreateSessionResponse = useCallback((data: any) => {
    if (!data || !Array.isArray(data)) return;
    
    const sessionData = data[0];
    if (!sessionData) {
      setError('Failed to create session');
      return;
    }
    
    if (!walletAddress) {
      setError('Wallet address is required');
      return;
    }

    const newSession: SessionInfo = {
      sessionId: sessionData.session_id,
      status: 'open',
      participant: walletAddress,
      eventSlug: eventSlug,
      balance: '0.00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSessionInfo(newSession);
    setIsSessionOpen(true);
    setIsLoading(false);
    
    // Save to localStorage
    localStorage.setItem(getStorageKey(eventSlug, 'sessionId'), newSession.sessionId);
    localStorage.setItem(getStorageKey(eventSlug, 'sessionInfo'), JSON.stringify(newSession));
  }, [walletAddress, eventSlug]);

  // Handle balance response
  // biome-ignore lint: life is hard
  const handleBalanceResponse = useCallback((data: any) => {
    if (!data || !Array.isArray(data)) return;
    
    const balanceData = data[0];
    if (balanceData?.balance) {
      setOffchainBalance(balanceData.balance);
      
      // Update stored session info
      if (sessionInfo) {
        const updatedSession = { ...sessionInfo, balance: balanceData.balance };
        setSessionInfo(updatedSession);
        localStorage.setItem(getStorageKey(eventSlug, 'sessionInfo'), JSON.stringify(updatedSession));
      }
    }
  }, [sessionInfo, eventSlug]);

  // Create session
  const createSession = useCallback(async () => {
    if (!walletAddress || !walletClient || !eventSlug) {
      setError('Missing required parameters');
      return;
    }

    // Check for existing session
    if (sessionInfo) {
      setError('Session already exists');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Ensure we're connected
    if (!clearNodeClient.current.isConnected) {
      await connectToClearNode();
      // Wait a bit for connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!clearNodeClient.current.isConnected) {
        setError('Failed to connect to ClearNode');
        setIsLoading(false);
        return;
      }
    }

    try {
      const request = await createSignedRequest(
        messageSigner,
        'create_session',
        [{
          event_slug: eventSlug,
          participant: walletAddress,
          initial_balance: '0',
          metadata: {
            created_by: 'mivio_event_app',
            event_slug: eventSlug,
          }
        }]
      );
      
      await clearNodeClient.current.sendRequest(request);
    } catch (err) {
      console.error('Failed to create session:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
      setIsLoading(false);
    }
  }, [walletAddress, walletClient, eventSlug, sessionInfo, messageSigner, connectToClearNode]);

  // Update balance
  const updateBalance = useCallback(async () => {
    if (!sessionInfo?.sessionId || !walletAddress || !clearNodeClient.current.isConnected) return;

    try {
      const request = await createSignedRequest(
        messageSigner,
        'get_session_balance',
        [{
          session_id: sessionInfo.sessionId,
          participant: walletAddress
        }]
      );
      
      await clearNodeClient.current.sendRequest(request);
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  }, [sessionInfo, walletAddress, messageSigner]);

  // Send payment through session
  const sendPayment = useCallback(async (
    recipientAddress: `0x${string}`,
    amount: string,
    memo?: string
  ) => {
    if (!sessionInfo?.sessionId || !walletAddress || !clearNodeClient.current.isConnected) {
      setError('Session not ready for payments');
      return null;
    }

    try {
      const request = await createSignedRequest(
        messageSigner,
        'session_transfer',
        [{
          session_id: sessionInfo.sessionId,
          from: walletAddress,
          to: recipientAddress,
          amount: amount,
          memo: memo,
          timestamp: Date.now()
        }]
      );
      
      const result = await clearNodeClient.current.sendRequest(request);
      
      // Update balance after transfer
      await updateBalance();
      
      return result;
    } catch (err) {
      console.error('Failed to send payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to send payment');
      return null;
    }
  }, [sessionInfo, walletAddress, messageSigner, updateBalance]);

  // Auto-create session if user has joined event but no session
  useEffect(() => {
    if (
      participantStats &&
      !sessionInfo &&
      !isLoading &&
      walletAddress &&
      walletClient &&
      connectionStatus === 'connected'
    ) {
      createSession();
    }
  }, [participantStats, sessionInfo, isLoading, walletAddress, walletClient, connectionStatus, createSession]);

  // Update balance when session opens or periodically
  useEffect(() => {
    if (isSessionOpen && connectionStatus === 'connected') {
      updateBalance();
      
      // Update balance every 30 seconds
      const interval = setInterval(updateBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isSessionOpen, connectionStatus, updateBalance]);

  return {
    sessionInfo,
    isSessionOpen,
    offchainBalance,
    isLoading,
    error,
    connectionStatus,
    isConnected: clearNodeClient.current.isConnected,
    createSession,
    clearStoredSession,
    updateBalance,
    sendPayment,
    connectToClearNode,
  };
} 