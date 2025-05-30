'use client';

import { useState, useCallback } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import type { WalletClient } from 'viem';
import type { NitroliteClient } from '@erc7824/nitrolite';

interface UseEventJoinOptions {
  walletAddress: `0x${string}` | undefined;
  walletClient: WalletClient | undefined;
  nitroliteClient: NitroliteClient | undefined;
}

export function useEventJoin(options: UseEventJoinOptions) {
  const { walletAddress, walletClient, nitroliteClient } = options;
  const router = useRouter();
  
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Join event mutation
  const joinEventMutation = api.event.join.useMutation();

  /**
   * Join an event and set up channel
   */
  const joinEvent = useCallback(async (eventSlug: string) => {
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return { success: false };
    }

    setIsJoining(true);
    setError(null);

    try {
      // Step 1: Join the event
      const joinResult = await joinEventMutation.mutateAsync({
        eventSlug,
        walletAddress,
      });

      if (!joinResult.success) {
        throw new Error(joinResult.message || 'Failed to join event');
      }

      // Step 2: Navigate to event dashboard
      // The channel will be automatically initialized on the dashboard
      router.push(`/event/${eventSlug}/tasks`);

      return { 
        success: true, 
        eventWalletId: joinResult.eventWalletId,
        needsChannel: joinResult.needsChannel,
      };
    } catch (err) {
      console.error('Failed to join event:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to join event';
      setError(errorMessage);
      return { success: false };
    } finally {
      setIsJoining(false);
    }
  }, [walletAddress, joinEventMutation, router]);

  /**
   * Check if user has already joined an event
   */
  const checkEventMembership = useCallback(async (eventSlug: string) => {
    if (!walletAddress) return null;

    try {
      // Use the event router to check participation
      const userEvents = await api.event.getUserEvents.useQuery({
        walletAddress,
      }).refetch();

      const hasJoined = userEvents.data?.some(event => event.slug === eventSlug);
      return hasJoined;
    } catch (err) {
      console.error('Failed to check event membership:', err);
      return null;
    }
  }, [walletAddress]);

  return {
    joinEvent,
    checkEventMembership,
    isJoining,
    error,
  };
} 