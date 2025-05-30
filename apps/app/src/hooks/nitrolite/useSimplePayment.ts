"use client";

import {
	createAppSessionMessage,
	createCloseAppSessionMessage,
} from "@erc7824/nitrolite";
import type { NitroliteClient } from "@erc7824/nitrolite";
import { useCallback, useState } from "react";
import type { WalletClient } from "viem";
import { keccak256, toBytes, toHex } from "viem";

interface UseSimplePaymentOptions {
	channelId: string | null;
	walletAddress: `0x${string}` | undefined;
	walletClient: WalletClient | undefined;
	nitroliteClient: NitroliteClient | undefined;
	clearNodeWs: WebSocket | null;
}

/**
 * Simple payment hook inspired by tictactoe example
 * Handles payments directly without server involvement
 */
export function useSimplePayment(options: UseSimplePaymentOptions) {
	const {
		channelId,
		walletAddress,
		walletClient,
		nitroliteClient,
		clearNodeWs,
	} = options;
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Message signer (similar to tictactoe)
	const messageSigner = useCallback(
		async (payload: unknown) => {
			if (!walletClient || !walletClient.account)
				throw new Error("Wallet not connected");

			const message = JSON.stringify(payload);
			const digestHex = keccak256(toHex(message));
			const messageBytes = toBytes(digestHex);

			// Sign with wallet
			const signature = await walletClient.signMessage({
				account: walletClient.account,
				message: { raw: messageBytes },
			});

			return signature;
		},
		[walletClient],
	);

	// Send payment to another participant
	const sendPayment = useCallback(
		async (
			recipientAddress: `0x${string}`,
			amount: string, // Amount in USDC
			memo?: string,
		) => {
			if (!channelId || !walletAddress || !clearNodeWs) {
				setError("Missing required parameters");
				return null;
			}

			setIsProcessing(true);
			setError(null);

			try {
				// Step 1: Create app session
				const appDefinition = {
					protocol: "nitroliterpc",
					participants: [walletAddress, recipientAddress],
					weights: [100, 0], // Sender has full control
					quorum: 100,
					challenge: 0,
					nonce: Date.now(),
				};

				const allocations = [
					{
						participant: walletAddress,
						asset: "usdc",
						amount: amount,
					},
					{
						participant: recipientAddress,
						asset: "usdc",
						amount: "0",
					},
				];

				// Create app session message
				const createSessionMsg = await createAppSessionMessage(messageSigner, [
					{
						definition: appDefinition,
						allocations: allocations,
					},
				]);

				// Send and wait for response
				const appSessionId = await new Promise<string>((resolve, reject) => {
					const handleMessage = (event: MessageEvent) => {
						try {
							const message = JSON.parse(event.data);
							if (message.res && message.res[1] === "create_app_session") {
								clearNodeWs.removeEventListener("message", handleMessage);
								const sessionId = message.res[2]?.[0]?.app_session_id;
								if (sessionId) {
									resolve(sessionId);
								} else {
									reject(new Error("No session ID in response"));
								}
							}
						} catch (err) {
							console.error("Error parsing message:", err);
						}
					};

					clearNodeWs.addEventListener("message", handleMessage);
					clearNodeWs.send(createSessionMsg);

					// Timeout after 10s
					setTimeout(() => {
						clearNodeWs.removeEventListener("message", handleMessage);
						reject(new Error("App session creation timeout"));
					}, 10000);
				});

				// Step 2: Close app session with payment to recipient
				const finalAllocations = [
					{
						participant: walletAddress,
						asset: "usdc",
						amount: "0",
					},
					{
						participant: recipientAddress,
						asset: "usdc",
						amount: amount,
					},
				];

				const closeSessionMsg = await createCloseAppSessionMessage(
					messageSigner,
					[
						{
							app_session_id: appSessionId as `0x${string}`,
							allocations: finalAllocations,
						},
					],
				);

				// Send close message
				await new Promise<void>((resolve, reject) => {
					const handleMessage = (event: MessageEvent) => {
						try {
							const message = JSON.parse(event.data);
							if (message.res && message.res[1] === "close_app_session") {
								clearNodeWs.removeEventListener("message", handleMessage);
								resolve();
							}
						} catch (err) {
							console.error("Error parsing message:", err);
						}
					};

					clearNodeWs.addEventListener("message", handleMessage);
					clearNodeWs.send(closeSessionMsg);

					// Timeout after 10s
					setTimeout(() => {
						clearNodeWs.removeEventListener("message", handleMessage);
						reject(new Error("Close session timeout"));
					}, 10000);
				});

				// Payment successful!
				return {
					success: true,
					appSessionId,
					recipient: recipientAddress,
					amount,
					memo,
					timestamp: Date.now(),
				};
			} catch (err) {
				console.error("Payment failed:", err);
				setError(err instanceof Error ? err.message : "Payment failed");
				return null;
			} finally {
				setIsProcessing(false);
			}
		},
		[channelId, walletAddress, clearNodeWs, messageSigner],
	);

	return {
		sendPayment,
		isProcessing,
		error,
	};
}

/**
 * Example usage in a task component:
 *
 * function TaskReward({ task, recipientAddress }) {
 *   const { sendPayment, isProcessing } = useSimplePayment({
 *     channelId,
 *     walletAddress,
 *     walletClient,
 *     nitroliteClient,
 *     clearNodeWs,
 *   });
 *
 *   const handleReward = async () => {
 *     // Send payment directly
 *     const result = await sendPayment(
 *       recipientAddress,
 *       task.rewardAmount,
 *       `Reward for completing: ${task.title}`
 *     );
 *
 *     if (result?.success) {
 *       // Just notify server about completion (no payment logic)
 *       await api.task.markCompleted.mutate({
 *         taskId: task.id,
 *         txHash: result.appSessionId
 *       });
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleReward} disabled={isProcessing}>
 *       Send Reward
 *     </button>
 *   );
 * }
 */
