'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import { getChannelManager } from '~/services/nitrolite/channelManager';
import { getClearNodeClient } from '~/services/nitrolite/clearNodeClient';
import type { WalletClient } from 'viem';
import { NitroliteClient } from '@erc7824/nitrolite';
import { useParams } from 'next/navigation';

interface UseEventChannelOptions {
  walletAddress: `0x${string}` | undefined;
  walletClient: WalletClient | undefined;
  nitroliteClient: NitroliteClient | undefined;
}

export function useEventChannel(options: UseEventChannelOptions) {
  const { walletAddress, walletClient, nitroliteClient } = options;
  const params = useParams();
  const eventSlug = params?.eventSlug as string;

  const [isInitializing, setIsInitializing] = useState(false);
  const [channelStatus, setChannelStatus] = useState<'none' | 'pending' | 'connecting' | 'open' | 'failed'>('none');
  const [error, setError] = useState<string | null>(null);
  const [offchainBalance, setOffchainBalance] = useState<string>('0.00');

  // Get channel status from database
  const { data: channelData, refetch: refetchChannelStatus } = api.channel.getChannelStatus.useQuery(
    { eventSlug, walletAddress: walletAddress! },
    { enabled: !!eventSlug && !!walletAddress }
  );

  // Update local state when channel data changes
  useEffect(() => {
    if (channelData?.hasChannel) {
      setChannelStatus(channelData.status as any);
      setOffchainBalance(channelData.offchainBalance);
    } else if (channelData?.needsChannel) {
      setChannelStatus('none');
    }
  }, [channelData]);

  // Initialize channel mutation
  const initializeChannelMutation = api.channel.initializeChannel.useMutation({
    onSuccess: () => {
      refetchChannelStatus();
    },
  });

  // Confirm channel mutation
  const confirmChannelMutation = api.channel.confirmChannel.useMutation({
    onSuccess: () => {
      refetchChannelStatus();
    },
  });

  // Update status mutation
  const updateStatusMutation = api.channel.updateChannelStatus.useMutation();

  // Update balance mutation
  const updateBalanceMutation = api.channel.updateOffchainBalance.useMutation();

  /**
   * Initialize and create channel
   */
  const initializeChannel = useCallback(async () => {
    if (!walletAddress || !walletClient || !nitroliteClient || !eventSlug) {
      setError('Missing required parameters for channel creation');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Step 1: Initialize channel in database
      const initResult = await initializeChannelMutation.mutateAsync({
        eventSlug,
        walletAddress,
      });

      if (!initResult.success) {
        throw new Error(initResult.message || 'Failed to initialize channel');
      }

      const { channelId, eventWalletId } = initResult;

      // Step 2: Update status to connecting
      await updateStatusMutation.mutateAsync({
        channelId,
        status: 'connecting',
        walletAddress,
      });
      setChannelStatus('connecting');

      // Step 3: Create actual Nitrolite channel
      const channelManager = getChannelManager();
      const channelInfo = await channelManager.createChannel({
        eventWalletId,
        userAddress: walletAddress,
        walletClient,
        nitroliteClient,
      });

      // Step 4: Confirm channel creation in database
      await confirmChannelMutation.mutateAsync({
        channelId,
        nitroliteChannelId: channelInfo.channelId,
        walletAddress,
      });

      setChannelStatus('open');
      setError(null);
    } catch (err) {
      console.error('Channel creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create channel';
      setError(errorMessage);
      setChannelStatus('failed');

      // Update database with failure status
      if (channelData?.channelId) {
        await updateStatusMutation.mutateAsync({
          channelId: channelData.channelId,
          status: 'failed',
          errorMessage,
          walletAddress,
        });
      }
    } finally {
      setIsInitializing(false);
    }
  }, [
    walletAddress,
    walletClient,
    nitroliteClient,
    eventSlug,
    channelData,
    initializeChannelMutation,
    confirmChannelMutation,
    updateStatusMutation,
  ]);

  /**
   * Check and update balance
   */
  const updateBalance = useCallback(async () => {
    if (!channelData?.channelId || !channelData.hasChannel || channelStatus !== 'open') {
      return;
    }

    try {
      const channelManager = getChannelManager();
      const balances = await channelManager.getChannelBalance(channelData.channelId);
      
      // Find USDC balance
      const usdcBalance = balances.find(b => b.asset.toLowerCase() === 'usdc');
      if (usdcBalance) {
        setOffchainBalance(usdcBalance.amount);
        
        // Update in database
        await updateBalanceMutation.mutateAsync({
          channelId: channelData.channelId,
          offchainBalance: usdcBalance.amount,
          walletAddress: walletAddress!,
        });
      }
    } catch (err) {
      console.error('Failed to update balance:', err);
    }
  }, [channelData, channelStatus, walletAddress, updateBalanceMutation]);

  /**
   * Set up WebSocket status listener
   */
  useEffect(() => {
    if (!channelData?.hasChannel || channelStatus !== 'open') return;

    const clearNodeClient = getClearNodeClient();
    const unsubscribe = clearNodeClient.onStatusChange((status) => {
      if (status === 'disconnected' || status === 'auth_failed') {
        setChannelStatus('failed');
      } else if (status === 'connected') {
        setChannelStatus('open');
      }
    });

    return unsubscribe;
  }, [channelData, channelStatus]);

  /**
   * Auto-initialize channel if needed
   */
  useEffect(() => {
    if (
      channelData?.needsChannel &&
      !channelData.hasChannel &&
      !isInitializing &&
      channelStatus === 'none' &&
      walletAddress &&
      walletClient &&
      nitroliteClient
    ) {
      // Auto-initialize channel
      initializeChannel();
    }
  }, [
    channelData,
    isInitializing,
    channelStatus,
    walletAddress,
    walletClient,
    nitroliteClient,
    initializeChannel,
  ]);

  return {
    channelStatus,
    offchainBalance,
    isInitializing,
    error,
    hasChannel: channelData?.hasChannel ?? false,
    needsChannel: channelData?.needsChannel ?? false,
    initializeChannel,
    updateBalance,
    refetchStatus: refetchChannelStatus,
  };
} 