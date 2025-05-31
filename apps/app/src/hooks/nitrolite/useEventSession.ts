"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WalletClient } from "viem";
import { getAddress } from "viem";
import { 
	createAppSessionMessage, 
	createCloseAppSessionMessage, 
	createGetLedgerBalancesMessage, 
	type RequestData, 
	type ResponsePayload 
} from "@erc7824/nitrolite";
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

interface LedgerBalance {
	asset: string;
	amount: string;
}

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

export function useEventSession(options: UseEventSessionOptions) {
	const { walletAddress, walletClient, eventSlug } = options;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
	const [isSessionOpen, setIsSessionOpen] = useState(false);
	const [offchainBalance, setOffchainBalance] = useState("0.00");
	const [ledgerBalances, setLedgerBalances] = useState<LedgerBalance[]>([]);
	const [connectionStatus, setConnectionStatus] =
		useState<WSStatus>("disconnected");

	const clearNodeClient = useRef(getClearNodeClient());
	const unsubscribeStatusRef = useRef<(() => void) | null>(null);
	const unsubscribeMessageRef = useRef<(() => void) | null>(null);

	// Check if user has joined the event
	const { data: participantStats } = api.event.getParticipantStats.useQuery(
		{ eventSlug, walletAddress: walletAddress ?? ("" as `0x${string}`) },
		{ enabled: !!eventSlug && !!walletAddress },
	);

	// Subscribe to ClearNode status and messages on mount
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
				console.log("message in unsubscribeMessageRef", message);
				// Handle session-specific messages
				if (message.res && message.res[1] === "get_sessions") {
					handleSessionsResponse(message.res[2]);
				} else if (message.res && message.res[1] === "create_app_session") {
					handleCreateSessionResponse(message.res[2]);
				} else if (message.res && message.res[1] === "get_session_balance") {
					handleBalanceResponse(message.res[2]);
				} else if (message.res && message.res[1] === "get_ledger_balances") {
					handleLedgerBalancesResponse(message.res[2]);
				}
			},
		);

		// Cleanup on unmount
		return () => {
			if (unsubscribeStatusRef.current) {
				unsubscribeStatusRef.current();
			}
			if (unsubscribeMessageRef.current) {
				unsubscribeMessageRef.current();
			}
			// Disconnect on unmount
			clearNodeClient.current.close();
		};
	}, []);

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

			// Request session info after connection
			// await requestSessionInfo();
			
			// Request ledger balances after connection
			// await requestLedgerBalances();
			
		} catch (err) {
			console.error("Failed to connect to ClearNode:", err);
			setError(
				err instanceof Error ? err.message : "Failed to connect to ClearNode",
			);
		}
	}, [walletAddress, walletClient, eventSlug]);

	// Handle sessions response
	const handleSessionsResponse = useCallback(
		// biome-ignore lint: life is hard
		(data: any) => {
			console.log("handleSessionsResponse", data);
			if (!data || !Array.isArray(data)) return;

			const sessions = data[0];
			if (!sessions || sessions.length === 0) {
				console.log("No active sessions found for event");
				return;
			}

			console.log("sessions", sessions);

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
				participant: getAddress(walletAddress),
				eventSlug: eventSlug,
				balance: sessionData.balance || "0.00",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			setSessionInfo(newSession);
			setIsSessionOpen(true);
			setIsLoading(false);
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
				}
			}
		},
		[sessionInfo],
	);

	// Request ledger balances using the ClearNode client's message signer
	const requestLedgerBalances = useCallback(async () => {
		if (!walletAddress || !walletClient || !clearNodeClient.current.isConnected) return;

		try {
			// Get the message signer from the ClearNode client
			const messageSigner = clearNodeClient.current.getMessageSigner();
			
			// Create signer compatible with createGetLedgerBalancesMessage
			const signer = async (payload: RequestData | ResponsePayload) => {
				return messageSigner({ payload, walletClient });
			};

			// Create the get ledger balances message
			console.log("requestLedgerBalances", getAddress(walletAddress));
			const message = await createGetLedgerBalancesMessage(signer, getAddress(walletAddress));
			
			// Send the request
			await clearNodeClient.current.sendRequest(message);
		} catch (err) {
			console.error("Failed to request ledger balances:", err);
		}
	}, [walletAddress, walletClient]);

	// Handle ledger balances response
	const handleLedgerBalancesResponse = useCallback(
		// biome-ignore lint: life is hard
		(data: any) => {
			console.log("handleLedgerBalancesResponse", data);
			if (!data || !Array.isArray(data)) return;

			const balances = data[0];
			if (!balances || !Array.isArray(balances)) {
				console.log("No ledger balance data available");
				setLedgerBalances([]);
				return;
			}

			// Update ledger balances
			setLedgerBalances(balances);
			
			// Also update the offchain balance if USDC is present
			const usdcBalance = balances.find((b: LedgerBalance) => b.asset.toLowerCase() === 'usdc');
			if (usdcBalance) {
				setOffchainBalance(usdcBalance.amount);
			}
		},
		[],
	);

	// Create session using the ClearNode client's message signer
	const createSession = useCallback(async () => {
		console.log("createSession");
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
						// Get the message signer from the ClearNode client
						const messageSigner = clearNodeClient.current.getMessageSigner();
						
			const appDefinition = {
				protocol: "mivio", // Use the same protocol as tictactoe
				participants: [getAddress(walletAddress), getAddress(eventOrganizerAddress)], // User and event organizer
				weights: [100, 0], // User has full control for their transactions
				quorum: 100, // Required consensus percentage
				challenge: 0, // No challenge period
				nonce: Date.now(), // Unique identifier
			};

			// Define allocations
			const allocations = [
				{
					participant: getAddress(walletAddress),
					asset: "usdc", // Using 'usdc' as asset identifier
					amount: "0.1", // Start with 0.1 USDC
				},
				{
					participant: getAddress(eventOrganizerAddress),
					asset: "usdc",
					amount: "0", // Organizer starts with 0
				},
			];


			
			// Create signer compatible with createAppSessionMessage
			const signer = async (payload: RequestData | ResponsePayload) => {
				return messageSigner({ payload, walletClient });
			};

			// Create a signed message using the createAppSessionMessage helper
			const signedMessage = await createAppSessionMessage(
				signer,
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

	// Close session and transfer funds
	const closeSession = useCallback(async () => {
		if (!walletAddress || !walletClient || !eventSlug || !sessionInfo?.sessionId) {
			setError("Missing required parameters or no active session");
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
			const eventOrganizerAddress = "0x81d786b35f3EA2F39Aa17cb18d9772E4EcD97206" as `0x${string}`;
			
			// Define final allocations - transfer 0.1 USDC to organizer
			const finalAllocations = [
				{
					participant: getAddress(walletAddress),
					asset: "usdc",
					amount: "0", // User ends with 0
				},
				{
					participant: getAddress(eventOrganizerAddress),
					asset: "usdc", 
					amount: "0.1", // Organizer receives 0.1 USDC
				},
			];

			// Get the message signer from the ClearNode client
			const messageSigner = clearNodeClient.current.getMessageSigner();
			
			// Create signer compatible with createCloseAppSessionMessage
			const signer = async (payload: RequestData | ResponsePayload) => {
				return messageSigner({ payload, walletClient });
			};

			// Create a signed message using the createCloseAppSessionMessage helper
			const signedMessage = await createCloseAppSessionMessage(
				signer,
				[
					{
						app_session_id: sessionInfo.sessionId as `0x${string}`,
						allocations: finalAllocations,
					},
				],
			);

			// Send the message and wait for response
			const response = await new Promise<unknown[]>((resolve, reject) => {
				const handleResponse = (message: { res?: unknown[]; err?: unknown[] }) => {
					try {
						// Check if this is an app session close response
						if (message.res && (message.res[1] === 'close_app_session' || 
						                   message.res[1] === 'app_session_closed')) {
							console.log("handleCloseSessionResponse", message.res);
							resolve(message.res[2] as unknown[]); 
						}
						
						// Also check for error responses
						if (message.err) {
							reject(new Error(`Error ${message.err[1]}: ${JSON.stringify(message.err[2])}`));
						}
					} catch (error) {
						console.error('Error handling app session close response:', error);
					}
				};
				
				// Add message handler
				const unsubscribe = clearNodeClient.current.onMessage(handleResponse as (message: unknown) => void);
				
				// Send the request
				clearNodeClient.current.sendRequest(signedMessage).catch(reject);
				
				// Set timeout to prevent hanging
				setTimeout(() => {
					unsubscribe();
					reject(new Error('App session close timeout'));
				}, 10000);
			});

			// Handle the response
			if (response) {
				console.log("Session closed successfully:", response);
				// Clear the session info since it's now closed
				setSessionInfo(null);
				setIsSessionOpen(false);
				setOffchainBalance("0.00");
				setIsLoading(false);
				
				// Request updated ledger balances after closing
				await requestLedgerBalances();
			} else {
				throw new Error("Invalid response format");
			}
		} catch (err) {
			console.error("Failed to close application session:", err);
			setError(
				err instanceof Error ? err.message : "Failed to close application session",
			);
			setIsLoading(false);
		}
	}, [walletAddress, walletClient, eventSlug, sessionInfo, connectToClearNode, requestLedgerBalances]);

	// Close session with custom allocations using the ClearNode client's message signer
	const closeSessionWithAllocations = useCallback(async (recipientAddress: `0x${string}`, userAmount: string, recipientAmount: string) => {
		if (!walletAddress || !walletClient || !eventSlug || !sessionInfo?.sessionId) {
			setError("Missing required parameters or no active session");
			return;
		}

		// Ensure we're connected
		if (!clearNodeClient.current.isConnected) {
			await connectToClearNode();
			// Wait a bit for connection to establish
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (!clearNodeClient.current.isConnected) {
				setError("Failed to connect to ClearNode");
				return;
			}
		}

		try {
			// Define final allocations based on the parameters
			const finalAllocations = [
				{
					participant: getAddress(walletAddress),
					asset: "usdc",
					amount: userAmount, // User's remaining balance
				},
				{
					participant: getAddress(recipientAddress),
					asset: "usdc", 
					amount: recipientAmount, // Recipient receives the transfer amount
				},
			];

			// Get the message signer from the ClearNode client
			const messageSigner = clearNodeClient.current.getMessageSigner();
			
			// Create signer compatible with createCloseAppSessionMessage
			const signer = async (payload: RequestData | ResponsePayload) => {
				return messageSigner({ payload, walletClient });
			};

			// Create a signed message using the createCloseAppSessionMessage helper
			const signedMessage = await createCloseAppSessionMessage(
				signer,
				[
					{
						app_session_id: sessionInfo.sessionId as `0x${string}`,
						allocations: finalAllocations,
					},
				],
			);

			// Send the message and wait for response
			const response = await new Promise<unknown[]>((resolve, reject) => {
				const handleResponse = (message: { res?: unknown[]; err?: unknown[] }) => {
					try {
						// Check if this is an app session close response
						if (message.res && (message.res[1] === 'close_app_session' || 
						                   message.res[1] === 'app_session_closed')) {
							console.log("handleCloseSessionResponse", message.res);
							resolve(message.res[2] as unknown[]); 
						}
						
						// Also check for error responses
						if (message.err) {
							reject(new Error(`Error ${message.err[1]}: ${JSON.stringify(message.err[2])}`));
						}
					} catch (error) {
						console.error('Error handling app session close response:', error);
					}
				};
				
				// Add message handler
				const unsubscribe = clearNodeClient.current.onMessage(handleResponse as (message: unknown) => void);
				
				// Send the request
				clearNodeClient.current.sendRequest(signedMessage).catch(reject);
				
				// Set timeout to prevent hanging
				setTimeout(() => {
					unsubscribe();
					reject(new Error('App session close timeout'));
				}, 10000);
			});

			// Handle the response
			if (response) {
				console.log("Session closed successfully:", response);
				// Clear the session info since it's now closed
				setSessionInfo(null);
				setIsSessionOpen(false);
				setOffchainBalance("0.00");
				setIsLoading(false);
			} else {
				throw new Error("Invalid response format");
			}
		} catch (err) {
			console.error("Failed to close application session:", err);
			setError(
				err instanceof Error ? err.message : "Failed to close application session",
			);
			throw err; // Re-throw so the calling function can handle it
		}
	}, [walletAddress, walletClient, eventSlug, sessionInfo, connectToClearNode]);

	// Transfer funds within session and then close it
	const transferAndCloseSession = useCallback(async (recipientAddress: `0x${string}`, amount: string, memo?: string) => {
		if (!walletAddress || !walletClient || !eventSlug || !sessionInfo?.sessionId) {
			setError("Missing required parameters or no active session");
			return false;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Since session_transfer doesn't exist in the API, we'll close the session
			// with allocations that reflect the desired transfer
			console.log(`Closing session and transferring ${amount} USDC to ${recipientAddress}...`);
			
			// Calculate final allocations based on the transfer amount
			const transferAmount = Number.parseFloat(amount);
			const currentBalance = Number.parseFloat(offchainBalance);
			
			if (transferAmount > currentBalance) {
				setError("Insufficient balance for transfer");
				setIsLoading(false);
				return false;
			}
			
			const userFinalBalance = (currentBalance - transferAmount).toFixed(2);
			const recipientFinalBalance = transferAmount.toFixed(2);
			
			// Update the close session to use dynamic allocations
			await closeSessionWithAllocations(recipientAddress, userFinalBalance, recipientFinalBalance);
			
			setIsLoading(false);
			return true;
			
		} catch (err) {
			console.error("Failed to close session:", err);
			setError(
				err instanceof Error ? err.message : "Failed to close session",
			);
			setIsLoading(false);
			return false;
		}
	}, [walletAddress, walletClient, eventSlug, sessionInfo, offchainBalance, closeSessionWithAllocations]);

	return {
		sessionInfo,
		isSessionOpen,
		offchainBalance,
		ledgerBalances,
		isLoading,
		error,
		connectionStatus,
		isConnected: clearNodeClient.current.isConnected,
		createSession,
		closeSession,
		transferAndCloseSession,
		connectToClearNode,
		requestLedgerBalances,
	};
}
