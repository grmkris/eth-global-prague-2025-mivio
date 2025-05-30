"use client";

import type { NitroliteClient } from "@erc7824/nitrolite";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { WalletClient } from "viem";
import { getClearNodeClient } from "~/services/nitrolite/clearNodeClient";
import { api } from "~/trpc/react";

interface UseEventChannelSimpleOptions {
	walletAddress: `0x${string}` | undefined;
	walletClient: WalletClient | undefined;
	nitroliteClient: NitroliteClient | undefined;
}

// Storage keys for this event
const getStorageKey = (eventSlug: string, key: string) =>
	`nitrolite_${eventSlug}_${key}`;

export function useEventChannelSimple(options: UseEventChannelSimpleOptions) {
	const { walletAddress, walletClient, nitroliteClient } = options;
	const params = useParams();
	const eventSlug = params?.eventSlug as string;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [channelId, setChannelId] = useState<string | null>(null);
	const [isChannelOpen, setIsChannelOpen] = useState(false);
	const [offchainBalance, setOffchainBalance] = useState("0.00");

	// Check if user has joined the event
	const { data: participantStats } = api.event.getParticipantStats.useQuery(
		{ eventSlug, walletAddress: walletAddress || "" },
		{ enabled: !!eventSlug && !!walletAddress },
	);

	// Load saved channel on mount
	useEffect(() => {
		if (!eventSlug) return;

		const savedChannelId = localStorage.getItem(
			getStorageKey(eventSlug, "channelId"),
		);
		if (savedChannelId) {
			setChannelId(savedChannelId);
			setIsChannelOpen(true);
		}
	}, [eventSlug]);

	// Clear stored channel data
	const clearStoredChannel = useCallback(() => {
		if (!eventSlug) return;

		localStorage.removeItem(getStorageKey(eventSlug, "channelId"));
		localStorage.removeItem(getStorageKey(eventSlug, "channelState"));
		setChannelId(null);
		setIsChannelOpen(false);
		setOffchainBalance("0.00");
	}, [eventSlug]);

	// Create channel
	const createChannel = useCallback(async () => {
		if (!walletAddress || !walletClient || !nitroliteClient || !eventSlug) {
			setError("Missing required parameters");
			return;
		}

		// Check for existing channel
		if (channelId) {
			setError("Channel already exists");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Connect to ClearNode
			const clearNodeClient = getClearNodeClient();
			if (!clearNodeClient.isConnected) {
				await clearNodeClient.connect({
					walletAddress,
					signerAddress: walletAddress,
					walletClient,
				});
			}

			// Create the channel
			const result = await nitroliteClient.createChannel({
				initialAllocationAmounts: [BigInt(0), BigInt(0)],
				stateData: "0x",
			});

			// Save to localStorage
			localStorage.setItem(
				getStorageKey(eventSlug, "channelId"),
				result.channelId,
			);
			localStorage.setItem(
				getStorageKey(eventSlug, "channelState"),
				JSON.stringify(result.initialState),
			);

			setChannelId(result.channelId);
			setIsChannelOpen(true);
		} catch (err) {
			console.error("Failed to create channel:", err);
			setError(err instanceof Error ? err.message : "Failed to create channel");
		} finally {
			setIsLoading(false);
		}
	}, [walletAddress, walletClient, nitroliteClient, eventSlug, channelId]);

	// Update balance from ClearNode
	const updateBalance = useCallback(async () => {
		if (!channelId || !walletAddress) return;

		try {
			// In a real implementation, query ClearNode for balance
			// For now, use the on-chain balance from participantStats
			if (participantStats?.balance) {
				setOffchainBalance(participantStats.balance);
			}
		} catch (err) {
			console.error("Failed to update balance:", err);
		}
	}, [channelId, walletAddress, participantStats]);

	// Auto-create channel if user has joined event but no channel
	useEffect(() => {
		if (
			participantStats &&
			!channelId &&
			!isLoading &&
			walletAddress &&
			walletClient &&
			nitroliteClient
		) {
			createChannel();
		}
	}, [
		participantStats,
		channelId,
		isLoading,
		walletAddress,
		walletClient,
		nitroliteClient,
		createChannel,
	]);

	// Update balance when channel opens
	useEffect(() => {
		if (isChannelOpen) {
			updateBalance();
		}
	}, [isChannelOpen, updateBalance]);

	return {
		channelId,
		isChannelOpen,
		offchainBalance,
		isLoading,
		error,
		createChannel,
		clearStoredChannel,
		updateBalance,
	};
}
