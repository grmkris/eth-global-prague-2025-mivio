import {
	createAuthRequestMessage,
	createAuthVerifyMessage,
	createAuthVerifyMessageWithJWT,
} from "@erc7824/nitrolite";
import type { WalletClient } from "viem";

export type WSStatus =
	| "disconnected"
	| "connecting"
	| "authenticating"
	| "connected"
	| "reconnecting"
	| "auth_failed";

interface ClearNodeClientOptions {
	url: string;
	autoReconnect?: boolean;
	reconnectDelay?: number;
	maxReconnectAttempts?: number;
	requestTimeout?: number;
}

interface AuthParams {
	walletAddress: `0x${string}`;
	signerAddress: `0x${string}`;
	walletClient: WalletClient;
}

/**
 * EIP-712 domain and types for auth_verify challenge
 */
const AUTH_DOMAIN = {
	name: "Mivio Events",
};

const AUTH_TYPES = {
	Policy: [
		{ name: "challenge", type: "string" },
		{ name: "scope", type: "string" },
		{ name: "wallet", type: "address" },
		{ name: "application", type: "address" },
		{ name: "participant", type: "address" },
		{ name: "expire", type: "uint256" },
		{ name: "allowances", type: "Allowance[]" },
	],
	Allowance: [
		{ name: "asset", type: "string" },
		{ name: "amount", type: "uint256" },
	],
};

export class ClearNodeClient {
	private ws: WebSocket | null = null;
	private options: Required<ClearNodeClientOptions>;
	private reconnectAttempts = 0;
	private reconnectTimeout: NodeJS.Timeout | null = null;
	private statusHandlers: ((status: WSStatus) => void)[] = [];
	private messageHandlers: ((message: unknown) => void)[] = [];
	private pendingRequests = new Map<
		number,
		{ resolve: (value: unknown) => void; reject: (reason: Error) => void }
	>();
	private authParams: AuthParams | null = null;
	private isAuthenticated = false;

	constructor(options: ClearNodeClientOptions) {
		this.options = {
			url: options.url,
			autoReconnect: options.autoReconnect ?? true,
			reconnectDelay: options.reconnectDelay ?? 1000,
			maxReconnectAttempts: options.maxReconnectAttempts ?? 5,
			requestTimeout: options.requestTimeout ?? 10000,
		};
	}

	/**
	 * Connect to ClearNode and authenticate
	 */
	async connect(authParams: AuthParams): Promise<void> {
		this.authParams = authParams;

		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}

		if (this.isConnected) return;

		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.options.url);
				this.emitStatus("connecting");

				this.ws.onopen = async () => {
					try {
						this.emitStatus("authenticating");
						await this.authenticate();
						this.emitStatus("connected");
						this.isAuthenticated = true;
						this.reconnectAttempts = 0;
						resolve();
					} catch (error) {
						this.emitStatus("auth_failed");
						reject(error);
						this.close();
						this.handleReconnect();
					}
				};

				this.ws.onmessage = this.handleMessage.bind(this);

				this.ws.onerror = () => {
					reject(new Error("WebSocket connection error"));
				};

				this.ws.onclose = () => {
					this.emitStatus("disconnected");
					this.ws = null;
					this.isAuthenticated = false;

					for (const { reject } of this.pendingRequests.values()) {
						reject(new Error("WebSocket connection closed"));
					}
					this.pendingRequests.clear();

					this.handleReconnect();
				};
			} catch (error) {
				reject(error);
				this.handleReconnect();
			}
		});
	}

	/**
	 * Authenticate with ClearNode
	 */
	private async authenticate(): Promise<void> {
		if (!this.ws || !this.authParams)
			throw new Error("WebSocket not connected or auth params missing");

		const { walletAddress, signerAddress, walletClient } = this.authParams;

		// Check for JWT token first
		const jwtToken =
			typeof window !== "undefined"
				? window.localStorage?.getItem("clearnode_jwt")
				: null;

		let authRequest: string;

		if (jwtToken) {
			authRequest = await createAuthVerifyMessageWithJWT(jwtToken);
		} else {
			// Create initial auth request
			const expire = (Math.floor(Date.now() / 1000) + 3600).toString(); // 1 hour

			authRequest = await createAuthRequestMessage({
				wallet: walletAddress,
				participant: signerAddress,
				app_name: "Mivio Events",
				expire,
				scope: "events",
				application: walletAddress,
				allowances: [],
			});
		}

		this.ws.send(authRequest);

		return new Promise((resolve, reject) => {
			const authTimeout = setTimeout(() => {
				this.ws?.removeEventListener("message", handleAuthResponse);
				reject(new Error("Authentication timeout"));
			}, this.options.requestTimeout);

			const handleAuthResponse = async (event: MessageEvent) => {
				let response: unknown;

				try {
					response = JSON.parse(event.data);
				} catch {
					return; // Skip invalid messages
				}

				try {
					if (response.res && response.res[1] === "auth_challenge") {
						// Create EIP-712 signer
						const eip712Signer = async (data: unknown): Promise<`0x${string}`> => {
							// Extract challenge from response
							const challenge = response.res[2]?.[0]?.challenge_message || "";

							const message = {
								challenge,
								scope: "events",
								wallet: walletAddress,
								application: walletAddress,
								participant: signerAddress,
								expire: Math.floor(Date.now() / 1000) + 3600,
								allowances: [],
							};  

							if (!walletClient.account) {
								throw new Error("Wallet account not found");
							}

							const signature = await walletClient.signTypedData({
								account: walletClient.account,
								domain: AUTH_DOMAIN,
								types: AUTH_TYPES,
								primaryType: "Policy",
								message,
							});

							return signature;
						};

						// Send auth verify
						const authVerify = await createAuthVerifyMessage(
							eip712Signer,
							event.data,
						);
						this.ws?.send(authVerify);
					} else if (response.res && response.res[1] === "auth_success") {
						// Store JWT if provided
						if (
							response.res[2]?.[0]?.jwt_token &&
							typeof window !== "undefined"
						) {
							window.localStorage?.setItem(
								"clearnode_jwt",
								response.res[2][0].jwt_token,
							);
						}

						clearTimeout(authTimeout);
						this.ws?.removeEventListener("message", handleAuthResponse);
						resolve();
					} else if (
						response.err ||
						(response.res && response.res[1] === "auth_failure")
					) {
						const errorMsg =
							response.err?.[2] || response.res?.[2] || "Authentication failed";
						if (typeof window !== "undefined") {
							window.localStorage?.removeItem("clearnode_jwt");
						}
						clearTimeout(authTimeout);
						this.ws?.removeEventListener("message", handleAuthResponse);
						reject(new Error(String(errorMsg)));
					}
				} catch (error) {
					clearTimeout(authTimeout);
					this.ws?.removeEventListener("message", handleAuthResponse);
					reject(error);
				}
			};

			this.ws?.addEventListener("message", handleAuthResponse);
		});
	}

	/**
	 * Handle incoming messages
	 */
	private handleMessage(event: MessageEvent): void {
		let message: unknown;

		try {
			message = JSON.parse(event.data);
		} catch (error) {
			console.error("Failed to parse message:", event.data);
			return;
		}

		// Notify message handlers
		for (const handler of this.messageHandlers) {
			handler(message);
		}

		// Handle RPC responses
		if (message.res && Array.isArray(message.res) && message.res.length >= 3) {
			const requestId = message.res[0];
			if (this.pendingRequests.has(requestId)) {
				const request = this.pendingRequests.get(requestId);
				if (request) {
					request.resolve(message.res[2]);
				}
				this.pendingRequests.delete(requestId);
			}
		}

		// Handle errors
		if (message.err && Array.isArray(message.err) && message.err.length >= 3) {
			const requestId = message.err[0];
			const errorMessage = `Error ${message.err[1]}: ${message.err[2]}`;

			if (this.pendingRequests.has(requestId)) {
				const request = this.pendingRequests.get(requestId);
				if (request) {
					request.reject(new Error(errorMessage));
				}
				this.pendingRequests.delete(requestId);
			}
		}
	}

	/**
	 * Handle reconnection
	 */
	private handleReconnect(): void {
		if (
			!this.options.autoReconnect ||
			this.reconnectAttempts >= this.options.maxReconnectAttempts
		) {
			return;
		}

		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}

		this.reconnectAttempts++;
		const delay = this.options.reconnectDelay * this.reconnectAttempts;

		this.emitStatus("reconnecting");

		this.reconnectTimeout = setTimeout(() => {
			if (this.authParams) {
				this.connect(this.authParams).catch(() => {
					// Silent catch to prevent unhandled rejections
				});
			}
		}, delay);
	}

	/**
	 * Send a request to ClearNode
	 */
	async sendRequest(signedRequest: string): Promise<unknown> {
		if (!this.isConnected || !this.ws) {
			throw new Error("WebSocket not connected");
		}

		let requestId: number;

		try {
			const parsedRequest = JSON.parse(signedRequest);
			requestId = parsedRequest.req[0];
		} catch (error) {
			throw new Error("Failed to parse request");
		}

		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.pendingRequests.delete(requestId);
				reject(new Error("Request timeout"));
			}, this.options.requestTimeout);

			this.pendingRequests.set(requestId, {
				resolve: (result: unknown) => {
					clearTimeout(timeout);
					resolve(result);
				},
				reject: (error: Error) => {
					clearTimeout(timeout);
					reject(error);
				},
			});

			try {
				if (this.ws) {
					this.ws.send(signedRequest);
				}
			} catch (error) {
				clearTimeout(timeout);
				this.pendingRequests.delete(requestId);
				reject(error);
			}
		});
	}

	/**
	 * Close the connection
	 */
	close(): void {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}

		if (this.ws) {
			this.ws.close(1000, "Normal closure");
		}

		this.ws = null;
		this.isAuthenticated = false;
		this.pendingRequests.clear();
		this.emitStatus("disconnected");
	}

	/**
	 * Register status change handler
	 */
	onStatusChange(handler: (status: WSStatus) => void): () => void {
		this.statusHandlers.push(handler);
		return () => {
			this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
		};
	}

	/**
	 * Register message handler
	 */
	onMessage(handler: (message: unknown) => void): () => void {
		this.messageHandlers.push(handler);
		return () => {
			this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
		};
	}

	/**
	 * Get connection status
	 */
	get isConnected(): boolean {
		return (
			this.ws !== null &&
			this.ws.readyState === WebSocket.OPEN &&
			this.isAuthenticated
		);
	}

	/**
	 * Get WebSocket readyState
	 */
	get readyState(): number {
		return this.ws?.readyState ?? WebSocket.CLOSED;
	}

	/**
	 * Emit status change
	 */
	private emitStatus(status: WSStatus): void {
		for (const handler of this.statusHandlers) {
			handler(status);
		}
	}
}

// Singleton instance management
let clearNodeInstance: ClearNodeClient | null = null;

export function getClearNodeClient(): ClearNodeClient {
	if (!clearNodeInstance) {
		clearNodeInstance = new ClearNodeClient({
			url:
				process.env.NEXT_PUBLIC_CLEARNODE_URL || "wss://clearnet.yellow.com/ws",
		});
	}
	return clearNodeInstance;
}
