"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WalletClient } from "viem";
import { keccak256, toBytes, toHex } from "viem";
import { createAppSessionMessage, type RequestData, type ResponsePayload } from "@erc7824/nitrolite";
import {
	type WSStatus,
	getClearNodeClient,
} from "~/services/nitrolite/clearNodeClient";
import { api } from "~/trpc/react";

interface UseEventSessionOptions {
	walletAddress: `0x${string}` | undefined;
	walletClient: WalletClient;
	eventSlug: string;
}

interface SessionInfo {
	sessionId: string;
	appSessionId?: string;
	status: "open" | "closed" | "settling";
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
const createSignedRequest = async (props: {
	signer: (props: {
		payload: unknown;
		walletClient: WalletClient;
	}) => Promise<string>;
	method: string;
	params: unknown[];
	walletClient: WalletClient;
}): Promise<string> => {
	const { signer, method, params, walletClient } = props;
	const requestId = Date.now();
	const timestamp = Date.now();
	const requestData = [requestId, method, params, timestamp];
	const request: { req: unknown[]; sig?: string[] } = { req: requestData };

	// Sign the request
	const signature = await signer({
		payload: request,
		walletClient: walletClient,
	});

	request.sig = [signature];

	return JSON.stringify(request);
};

// Message signer for ClearNode requests
const messageSigner = async (props: {
	payload: unknown;
	walletClient: WalletClient;
}) => {
	const { payload, walletClient } = props;
	if (!walletClient || !walletClient.account) {
		throw new Error("Wallet not connected");
	}

	const message = JSON.stringify(payload);
	const digestHex = keccak256(toHex(message));
	const messageBytes = toBytes(digestHex);

	const signature = await walletClient.signMessage({
		account: walletClient.account,
		message: { raw: messageBytes },
	});

	return signature;
};

export function useEventSession(options: UseEventSessionOptions) {
	const { walletAddress, walletClient, eventSlug } = options;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
	const [isSessionOpen, setIsSessionOpen] = useState(false);
	const [offchainBalance, setOffchainBalance] = useState("0.00");
	const [connectionStatus, setConnectionStatus] =
		useState<WSStatus>("disconnected");

	const clearNodeClient = useRef(getClearNodeClient());
	const unsubscribeStatusRef = useRef<(() => void) | null>(null);
	const unsubscribeMessageRef = useRef<(() => void) | null>(null);
	const hasManuallyConnectedRef = useRef(false);

	// Check if user has joined the event
	const { data: participantStats } = api.event.getParticipantStats.useQuery(
		{ eventSlug, walletAddress: walletAddress ?? ("" as `0x${string}`) },
		{ enabled: !!eventSlug && !!walletAddress },
	);

	// Load saved session on mount
	useEffect(() => {
		if (!eventSlug) return;

		const savedSessionId = localStorage.getItem(
			getStorageKey(eventSlug, "sessionId"),
		);
		const savedSessionInfo = localStorage.getItem(
			getStorageKey(eventSlug, "sessionInfo"),
		);

		if (savedSessionId && savedSessionInfo) {
			try {
				const sessionData = JSON.parse(savedSessionInfo) as SessionInfo;
				setSessionInfo(sessionData);
				setIsSessionOpen(sessionData.status === "open");
				setOffchainBalance(sessionData.balance || "0.00");
			} catch (err) {
				console.error("Failed to parse saved session info:", err);
			}
		}
	}, [eventSlug]);

	// Clear stored session data
	const clearStoredSession = useCallback(() => {
		if (!eventSlug) return;

		localStorage.removeItem(getStorageKey(eventSlug, "sessionId"));
		localStorage.removeItem(getStorageKey(eventSlug, "sessionInfo"));
		setSessionInfo(null);
		setIsSessionOpen(false);
		setOffchainBalance("0.00");
	}, [eventSlug]);

	// Connect to ClearNode
	const connectToClearNode = useCallback(async () => {
		if (!walletAddress || !walletClient || !eventSlug) {
			setError("Missing required parameters for connection");
			return;
		}

		setError(null);

		try {
			await clearNodeClient.current.connect({
				walletAddress,
				signerAddress: walletAddress,
				walletClient,
			});

			// Mark that user has manually connected
			hasManuallyConnectedRef.current = true;

			// Request session info after connection
			await requestSessionInfo();
		} catch (err) {
			console.error("Failed to connect to ClearNode:", err);
			setError(
				err instanceof Error ? err.message : "Failed to connect to ClearNode",
			);
		}
	}, [walletAddress, walletClient, eventSlug]);

	// Subscribe to ClearNode status and messages
	useEffect(() => {
		// Subscribe to status changes
		unsubscribeStatusRef.current = clearNodeClient.current.onStatusChange(
			(status) => {
				setConnectionStatus(status);
			},
		);

		// Subscribe to messages
		unsubscribeMessageRef.current = clearNodeClient.current.onMessage(
			// biome-ignore lint: life is hard
			(message: any) => {
				// Handle session-specific messages
				if (message.res && message.res[1] === "get_sessions") {
					handleSessionsResponse(message.res[2]);
				} else if (message.res && message.res[1] === "create_app_session") {
					handleCreateSessionResponse(message.res[2]);
				} else if (message.res && message.res[1] === "get_session_balance") {
					handleBalanceResponse(message.res[2]);
				}
			},
		);

		// Don't connect automatically - let user manually connect via button

		// Cleanup on unmount
		return () => {
			if (unsubscribeStatusRef.current) {
				unsubscribeStatusRef.current();
			}
			if (unsubscribeMessageRef.current) {
				unsubscribeMessageRef.current();
			}
		};
	}, []);

	// Request session information
	const requestSessionInfo = useCallback(async () => {
		if (!walletAddress || !clearNodeClient.current.isConnected) return;

		try {
			const request = await createSignedRequest({
				signer: messageSigner,
				method: "get_sessions",
				params: [
					{
						event_slug: eventSlug,
						participant: walletAddress,
					},
				],
				walletClient,
			});

			await clearNodeClient.current.sendRequest(request);
		} catch (err) {
			console.error("Failed to request session info:", err);
		}
	}, [walletAddress, eventSlug, walletClient]);

	// Handle sessions response
	const handleSessionsResponse = useCallback(
		// biome-ignore lint: life is hard
		(data: any) => {
			if (!data || !Array.isArray(data)) return;

			const sessions = data[0];
			if (!sessions || sessions.length === 0) {
				console.log("No active sessions found for event");
				return;
			}

			// Find session for current event
			const eventSession = sessions.find(
				// biome-ignore lint: life is hard
				(s: any) => s.event_slug === eventSlug,
			);
			if (eventSession) {
				const sessionData: SessionInfo = {
					sessionId: eventSession.session_id || eventSession.app_session_id,
					appSessionId: eventSession.app_session_id,
					status: eventSession.status,
					participant: eventSession.participant,
					eventSlug: eventSession.event_slug,
					balance: eventSession.balance || "0.00",
					createdAt: eventSession.created_at,
					updatedAt: eventSession.updated_at,
				};

				setSessionInfo(sessionData);
				setIsSessionOpen(sessionData.status === "open");
				setOffchainBalance(sessionData.balance);

				// Save to localStorage
				localStorage.setItem(
					getStorageKey(eventSlug, "sessionId"),
					sessionData.sessionId,
				);
				localStorage.setItem(
					getStorageKey(eventSlug, "sessionInfo"),
					JSON.stringify(sessionData),
				);
			}
		},
		[eventSlug],
	);

	// Handle create session response
	const handleCreateSessionResponse = useCallback(
		// biome-ignore lint: life is hard
		(data: any) => {
			console.log("handleCreateSessionResponse", data);
			if (!data || !Array.isArray(data)) return;

			const sessionData = data[0];
			if (!sessionData) {
				setError("Failed to create application session");
				return;
			}

			if (!walletAddress) {
				setError("Wallet address is required");
				return;
			}

			// Extract app_session_id from response
			const appSessionId = sessionData.app_session_id || sessionData.appSessionId;
			if (!appSessionId) {
				setError("No app session ID in response");
				return;
			}

			const newSession: SessionInfo = {
				sessionId: appSessionId, // Use app_session_id as the main identifier
				appSessionId: appSessionId,
				status: sessionData.status || "open",
				participant: walletAddress,
				eventSlug: eventSlug,
				balance: "0.00",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			setSessionInfo(newSession);
			setIsSessionOpen(true);
			setIsLoading(false);

			// Save to localStorage
			localStorage.setItem(
				getStorageKey(eventSlug, "sessionId"),
				newSession.sessionId,
			);
			localStorage.setItem(
				getStorageKey(eventSlug, "sessionInfo"),
				JSON.stringify(newSession),
			);
		},
		[walletAddress, eventSlug],
	);

	// Handle balance response
	const handleBalanceResponse = useCallback(
		// biome-ignore lint: life is hard
		(data: any) => {
			if (!data || !Array.isArray(data)) return;

			const balanceData = data[0];
			if (balanceData?.balance) {
				setOffchainBalance(balanceData.balance);

				// Update stored session info
				if (sessionInfo) {
					const updatedSession = {
						...sessionInfo,
						balance: balanceData.balance,
					};
					setSessionInfo(updatedSession);
					localStorage.setItem(
						getStorageKey(eventSlug, "sessionInfo"),
						JSON.stringify(updatedSession),
					);
				}
			}
		},
		[sessionInfo, eventSlug],
	);

	// Create session
	const createSession = useCallback(async () => {
		if (!walletAddress || !walletClient || !eventSlug) {
			setError("Missing required parameters");
			return;
		}

		// Check for existing session
		if (sessionInfo) {
			setError("Session already exists");
			return;
		}

		setIsLoading(true);
		setError(null);

		// Ensure we're connected
		if (!clearNodeClient.current.isConnected) {
			await connectToClearNode();
			// Wait a bit for connection to establish
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (!clearNodeClient.current.isConnected) {
				setError("Failed to connect to ClearNode");
				setIsLoading(false);
				return;
			}
		}

		try {
			// Define the application parameters (matching tictactoe example)
			const eventOrganizerAddress = "0x81d786b35f3EA2F39Aa17cb18d9772E4EcD97206" as `0x${string}`;
			
			const appDefinition = {
				protocol: "app_aura_nitrolite_v0", // Use the same protocol as tictactoe
				participants: [walletAddress, eventOrganizerAddress], // User and event organizer
				weights: [100, 0], // User has full control for their transactions
				quorum: 100, // Required consensus percentage
				challenge: 0, // No challenge period
				nonce: Date.now(), // Unique identifier
			};

			// Define allocations
			const allocations = [
				{
					participant: walletAddress,
					asset: "usdc", // Using 'usdc' as asset identifier
					amount: "0", // Start with 0 balance
				},
				{
					participant: eventOrganizerAddress,
					asset: "usdc",
					amount: "0", // Organizer starts with 0
				},
			];

			// Create signer compatible with createAppSessionMessage
			const signer = {
				sign: async (payload: RequestData | ResponsePayload) => {
					return messageSigner({ payload, walletClient });
				},
			};

			// Create a signed message using the createAppSessionMessage helper
			const signedMessage = await createAppSessionMessage(
				signer.sign,
				[
					{
						definition: appDefinition,
						allocations: allocations,
					},
				],
			);

			// Send the message and wait for response
			const response = await new Promise<unknown[]>((resolve, reject) => {
				const handleResponse = (message: { res?: unknown[]; err?: unknown[] }) => {
					try {
						// Check if this is an app session response
						if (message.res && (message.res[1] === 'create_app_session' || 
						                   message.res[1] === 'app_session_created')) {
							console.log("handleCreateSessionResponse", message.res);
							resolve(message.res[2] as unknown[]); // The app session data should be in the 3rd position
						}
						
						// Also check for error responses
						if (message.err) {
							reject(new Error(`Error ${message.err[1]}: ${JSON.stringify(message.err[2])}`));
						}
					} catch (error) {
						console.error('Error handling app session response:', error);
					}
				};
				
				// Add message handler
				const unsubscribe = clearNodeClient.current.onMessage(handleResponse as (message: unknown) => void);
				
				// Send the request
				clearNodeClient.current.sendRequest(signedMessage).catch(reject);
				
				// Set timeout to prevent hanging
				setTimeout(() => {
					unsubscribe();
					reject(new Error('App session creation timeout'));
				}, 10000);
			});

			// Handle the response
			if (response && Array.isArray(response) && response[0]) {
				handleCreateSessionResponse(response);
			} else {
				throw new Error("Invalid response format");
			}
		} catch (err) {
			console.error("Failed to create application session:", err);
			setError(
				err instanceof Error ? err.message : "Failed to create application session",
			);
			setIsLoading(false);
		}
	}, [walletAddress, walletClient, eventSlug, sessionInfo, connectToClearNode, handleCreateSessionResponse]);

	// Update balance
	const updateBalance = useCallback(async () => {
		if (
			!sessionInfo?.sessionId ||
			!walletAddress ||
			!clearNodeClient.current.isConnected
		)
			return;

		try {
			const request = await createSignedRequest({
				signer: messageSigner,
				method: "get_session_balance",
				params: [
					{
						session_id: sessionInfo.sessionId,
						participant: walletAddress,
					},
				],
				walletClient,
			});

			await clearNodeClient.current.sendRequest(request);
		} catch (err) {
			console.error("Failed to update balance:", err);
		}
	}, [sessionInfo, walletAddress, walletClient]);

	// Send payment through session
	const sendPayment = useCallback(
		async (recipientAddress: `0x${string}`, amount: string, memo?: string) => {
			if (
				!sessionInfo?.sessionId ||
				!walletAddress ||
				!clearNodeClient.current.isConnected
			) {
				setError("Session not ready for payments");
				return null;
			}

			try {
				const request = await createSignedRequest({
					signer: messageSigner,
					method: "session_transfer",
					params: [
						{
							session_id: sessionInfo.sessionId,
							from: walletAddress,
							to: recipientAddress,
							amount: amount,
							memo: memo,
							timestamp: Date.now(),
						},
					],
					walletClient,
				});

				const result = await clearNodeClient.current.sendRequest(request);

				// Update balance after transfer
				await updateBalance();

				return result;
			} catch (err) {
				console.error("Failed to send payment:", err);
				setError(err instanceof Error ? err.message : "Failed to send payment");
				return null;
			}
		},
		[sessionInfo, walletAddress, walletClient, updateBalance],
	);

	// Update balance when session opens or periodically
	useEffect(() => {
		if (isSessionOpen && connectionStatus === "connected") {
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
