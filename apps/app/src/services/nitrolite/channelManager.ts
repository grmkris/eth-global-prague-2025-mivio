import { NitroliteClient, createAppSessionMessage, createGetChannelsMessage, createGetLedgerBalancesMessage } from '@erc7824/nitrolite';
import type { Channel } from '@erc7824/nitrolite';
import { getClearNodeClient } from './clearNodeClient';
import type { WalletClient } from 'viem';

interface CreateChannelParams {
  eventWalletId: number;
  userAddress: `0x${string}`;
  walletClient: WalletClient;
  nitroliteClient: NitroliteClient;
}

interface ChannelInfo {
  channelId: string;
  channel: Channel;
  eventWalletId: number;
  userAddress: `0x${string}`;
  status: 'pending' | 'open' | 'failed';
  appSessionId?: string;
}

export class ChannelManager {
  private channels = new Map<number, ChannelInfo>(); // eventWalletId -> ChannelInfo
  private clearNodeClient = getClearNodeClient();

  /**
   * Create a channel for an event wallet
   */
  async createChannel(params: CreateChannelParams): Promise<ChannelInfo> {
    const { eventWalletId, userAddress, walletClient, nitroliteClient } = params;

    // Check if channel already exists for this wallet
    if (this.channels.has(eventWalletId)) {
      const existing = this.channels.get(eventWalletId)!;
      if (existing.status === 'open') {
        return existing;
      }
    }

    try {
      // Connect to ClearNode if not connected
      if (!this.clearNodeClient.isConnected) {
        await this.clearNodeClient.connect({
          walletAddress: userAddress,
          signerAddress: userAddress,
          walletClient,
        });
      }

      // Create the channel with initial allocations
      const channelResult = await nitroliteClient.createChannel({
        initialAllocationAmounts: [BigInt(0), BigInt(0)], // Start with 0 allocation
        stateData: '0x', // Empty initial state
      });

      const channelInfo: ChannelInfo = {
        channelId: channelResult.channelId,
        channel: channelResult.channel,
        eventWalletId,
        userAddress,
        status: 'open',
      };

      this.channels.set(eventWalletId, channelInfo);

      // Save to localStorage for recovery
      if (typeof window !== 'undefined') {
        const channelData = {
          channelId: channelResult.channelId,
          eventWalletId,
          userAddress,
          createdAt: Date.now(),
        };
        localStorage.setItem(`channel_${eventWalletId}`, JSON.stringify(channelData));
      }

      return channelInfo;
    } catch (error) {
      console.error('Failed to create channel:', error);
      
      const failedInfo: ChannelInfo = {
        channelId: '',
        channel: {} as Channel,
        eventWalletId,
        userAddress,
        status: 'failed',
      };
      
      this.channels.set(eventWalletId, failedInfo);
      throw error;
    }
  }

  /**
   * Create an app session for payments
   */
  async createAppSession(
    eventWalletId: number,
    recipientAddress: `0x${string}`,
    amount: bigint
  ): Promise<string> {
    const channelInfo = this.channels.get(eventWalletId);
    if (!channelInfo || channelInfo.status !== 'open') {
      throw new Error('Channel not found or not open');
    }

    // Create message signer
    const messageSigner = async (payload: any): Promise<`0x${string}`> => {
      // This would be signed by the wallet client
      // For now, returning a placeholder
      return '0x' as `0x${string}`;
    };

    // App session definition
    const appDefinition = {
      protocol: 'nitroliterpc',
      participants: [channelInfo.userAddress, recipientAddress],
      weights: [100, 0], // User has full control initially
      quorum: 100,
      challenge: 0,
      nonce: Date.now(),
    };

    // Allocations
    const allocations = [
      {
        participant: channelInfo.userAddress,
        asset: 'usdc',
        amount: amount.toString(),
      },
      {
        participant: recipientAddress,
        asset: 'usdc',
        amount: '0',
      },
    ];

    const signedMessage = await createAppSessionMessage(
      messageSigner,
      [{
        definition: appDefinition,
        allocations: allocations,
      }]
    );

    const response = await this.clearNodeClient.sendRequest(signedMessage);
    
    if (response && response[0]?.app_session_id) {
      channelInfo.appSessionId = response[0].app_session_id;
      return response[0].app_session_id;
    }

    throw new Error('Failed to create app session');
  }

  /**
   * Get channel balances
   */
  async getChannelBalance(eventWalletId: number): Promise<{ asset: string; amount: string }[]> {
    const channelInfo = this.channels.get(eventWalletId);
    if (!channelInfo || channelInfo.status !== 'open') {
      return [];
    }

    const messageSigner = async (payload: any): Promise<`0x${string}`> => {
      // This would be signed by the wallet client
      return '0x' as `0x${string}`;
    };

    const message = await createGetLedgerBalancesMessage(
      messageSigner,
      channelInfo.userAddress
    );

    const response = await this.clearNodeClient.sendRequest(message);
    
    if (response && response[0]) {
      return response[0];
    }

    return [];
  }

  /**
   * Check for existing channels on ClearNode
   */
  async checkExistingChannels(userAddress: `0x${string}`): Promise<any[]> {
    if (!this.clearNodeClient.isConnected) {
      return [];
    }

    const messageSigner = async (payload: any): Promise<`0x${string}`> => {
      // This would be signed by the wallet client
      return '0x' as `0x${string}`;
    };

    const message = await createGetChannelsMessage(
      messageSigner,
      userAddress
    );

    const response = await this.clearNodeClient.sendRequest(message);
    
    if (response && response[0]) {
      return response[0];
    }

    return [];
  }

  /**
   * Recover channel from localStorage
   */
  recoverChannel(eventWalletId: number): ChannelInfo | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(`channel_${eventWalletId}`);
    if (!stored) return null;

    try {
      const data = JSON.parse(stored);
      // In a real implementation, we would reconstruct the channel from stored state
      // For now, just marking it as pending recovery
      const channelInfo: ChannelInfo = {
        channelId: data.channelId,
        channel: {} as Channel, // Would need to reconstruct
        eventWalletId: data.eventWalletId,
        userAddress: data.userAddress,
        status: 'pending',
      };

      this.channels.set(eventWalletId, channelInfo);
      return channelInfo;
    } catch (error) {
      console.error('Failed to recover channel:', error);
      return null;
    }
  }

  /**
   * Get channel info
   */
  getChannel(eventWalletId: number): ChannelInfo | undefined {
    return this.channels.get(eventWalletId);
  }

  /**
   * Close all channels
   */
  async closeAll(): Promise<void> {
    this.clearNodeClient.close();
    this.channels.clear();
  }
}

// Singleton instance
let channelManagerInstance: ChannelManager | null = null;

export function getChannelManager(): ChannelManager {
  if (!channelManagerInstance) {
    channelManagerInstance = new ChannelManager();
  }
  return channelManagerInstance;
} 