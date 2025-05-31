"use client";

import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Send,
	Wifi,
	WifiOff,
	RefreshCw,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import type { WalletClient } from "viem";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEventSession } from "~/hooks/nitrolite/useEventSession";

interface NitroliteTestDashboardProps {
	walletAddress: `0x${string}`;
	walletClient: WalletClient;
	eventSlug: string;
}

export function NitroliteTestDashboard({
	walletAddress,
	walletClient,
	eventSlug,
}: NitroliteTestDashboardProps) {
	const [recipientAddress, setRecipientAddress] = useState("");
	const [paymentAmount, setPaymentAmount] = useState("10");
	const [paymentHistory, setPaymentHistory] = useState<
		Array<{
			id: string;
			recipient: string;
			amount: string;
			timestamp: number;
			status: "success" | "failed";
		}>
	>([]);
	const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
	const [paymentError, setPaymentError] = useState<string | null>(null);
	const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

	// Use the event session hook
	const {
		sessionInfo,
		isSessionOpen,
		offchainBalance,
		ledgerBalances,
		isLoading,
		error,
		connectionStatus,
		isConnected,
		createSession,
		connectToClearNode,
		transferAndCloseSession,
		requestLedgerBalances,
	} = useEventSession({ walletAddress, walletClient, eventSlug });

	// Check if wallet is connected
	if (!walletAddress || !walletClient) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="font-bold text-2xl">Nitrolite Test Dashboard</h1>
					<p className="text-muted-foreground">
						Test the event session integration with ClearNode
					</p>
				</div>

				<Card>
					<CardContent className="pt-6">
						<div className="space-y-4 text-center">
							<AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
							<h3 className="font-semibold text-lg">Wallet Not Connected</h3>
							<p className="text-muted-foreground">
								Please connect your wallet to use the Nitrolite test dashboard.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}
	// Handle payment
	const handlePayment = async () => {
		if (!recipientAddress || !paymentAmount) {
			alert("Please enter recipient address and amount");
			return;
		}

		setIsPaymentProcessing(true);
		setPaymentError(null);

		try {
			const success = await transferAndCloseSession(
				recipientAddress as `0x${string}`,
				paymentAmount,
				"Test payment from Nitrolite integration",
			);

			if (success) {
				// Add to payment history
				setPaymentHistory([
					{
						id: Date.now().toString(),
						recipient: recipientAddress,
						amount: paymentAmount,
						timestamp: Date.now(),
						status: "success",
					},
					...paymentHistory,
				]);

				// Clear form
				setRecipientAddress("");
				setPaymentAmount("10");
			} else {
				setPaymentError("Payment failed - check console for details");
			}
		} catch (err) {
			console.error("Payment error:", err);
			setPaymentError(err instanceof Error ? err.message : "Payment failed");
		} finally {
			setIsPaymentProcessing(false);
		}
	};

	// Get connection status color
	const getConnectionColor = () => {
		switch (connectionStatus) {
			case "connected":
				return "text-green-500";
			case "connecting":
			case "authenticating":
				return "text-yellow-500";
			case "disconnected":
			case "auth_failed":
				return "text-red-500";
			default:
				return "text-gray-500";
		}
	};

	// Handle manual balance refresh
	const handleRefreshBalance = async () => {
		setIsRefreshingBalance(true);
		try {
			await requestLedgerBalances();
			// Wait a bit to show the loading state
			setTimeout(() => setIsRefreshingBalance(false), 500);
		} catch (err) {
			console.error("Failed to refresh balance:", err);
			setIsRefreshingBalance(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl">Nitrolite Test Dashboard</h1>
				<p className="text-muted-foreground">
					Test the event session integration with ClearNode
				</p>
			</div>

			{/* Connection Status Card */}
			<Card>
				<CardHeader>
					<CardTitle>Connection Status</CardTitle>
					<CardDescription>
						{!isConnected
							? "Connect to ClearNode to enable off-chain payments"
							: "ClearNode WebSocket connection and session information"}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">WebSocket Status:</span>
						<div className="flex items-center gap-2">
							{isConnected ? (
								<Wifi className={`h-4 w-4 ${getConnectionColor()}`} />
							) : (
								<WifiOff className={`h-4 w-4 ${getConnectionColor()}`} />
							)}
							<Badge variant={isConnected ? "default" : "secondary"}>
								{connectionStatus}
							</Badge>
						</div>
					</div>

					{!isConnected && (
						<Alert>
							<Wifi className="h-4 w-4" />
							<AlertDescription>
								Click the button below to establish a connection to ClearNode and
								enable off-chain payment capabilities.
							</AlertDescription>
						</Alert>
					)}

					{sessionInfo && (
						<>
							<div className="flex items-center justify-between">
								<span className="font-medium text-sm">Session ID:</span>
								<span className="font-mono text-xs">
									{sessionInfo.sessionId.slice(0, 10)}...
									{sessionInfo.sessionId.slice(-8)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-medium text-sm">Session Status:</span>
								<Badge
									variant={
										sessionInfo.status === "open" ? "default" : "secondary"
									}
								>
									{sessionInfo.status}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-medium text-sm">Session Balance:</span>
								<span className="font-bold">${sessionInfo.balance}</span>
							</div>
						</>
					)}

					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="flex gap-2">
						{!isConnected && (
							<Button
								onClick={connectToClearNode}
								disabled={!walletAddress || !walletClient}
								className="flex-1"
								size="lg"
							>
								<Wifi className="mr-2 h-4 w-4" />
								Connect to ClearNode
							</Button>
						)}

						{isConnected && !sessionInfo && (
							<Button
								onClick={createSession}
								disabled={isLoading}
								className="flex-1"
								size="lg"
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Session...
									</>
								) : (
									<>
										<CheckCircle2 className="mr-2 h-4 w-4" />
										Create Payment Session
									</>
								)}
							</Button>
						)}

						{isConnected && isSessionOpen && (
							<div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500 text-sm">
								<CheckCircle2 className="h-4 w-4" />
								Session active - Ready for payments
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Manual Testing Controls */}
			{isConnected && (
				<Card>
					<CardHeader>
						<CardTitle>Manual Testing Controls</CardTitle>
						<CardDescription>
							Manually trigger API calls to test the integration
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

							<Button
								onClick={handleRefreshBalance}
								disabled={isRefreshingBalance}
								variant="outline"
								className="w-full"
							>
								{isRefreshingBalance ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Fetching Balances...
									</>
								) : (
									<>
										<RefreshCw className="mr-2 h-4 w-4" />
										Request Ledger Balances
									</>
								)}
							</Button>
						</div>
						
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Use these buttons to manually test the API calls. Check the browser console for detailed responses.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			)}

			{/* Ledger Balances Card */}
			{isConnected && (
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Ledger Balances</CardTitle>
								<CardDescription>
									Your off-chain balances across all assets (auto-refreshes every 30s)
								</CardDescription>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefreshBalance}
								disabled={isRefreshingBalance}
							>
								{isRefreshingBalance ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<RefreshCw className="h-4 w-4" />
								)}
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{ledgerBalances.length > 0 ? (
							<div className="space-y-2">
								{ledgerBalances.map((balance) => (
									<div
										key={balance.asset}
										className="flex items-center justify-between rounded-lg border p-3"
									>
										<div className="flex items-center gap-2">
											<Wallet className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium text-sm">
												{balance.asset.toUpperCase()}
											</span>
										</div>
										<span className="font-bold text-lg">
											{balance.amount}
										</span>
									</div>
								))}
							</div>
						) : (
							<div className="py-6 text-center text-muted-foreground">
								<Wallet className="mx-auto h-8 w-8 mb-2" />
								<p>No balances found</p>
								<p className="text-sm">
									Create a session to start with off-chain funds
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{/* Payment Form */}
			{isSessionOpen && (
				<Card>
					<CardHeader>
						<CardTitle>Transfer & Close Session</CardTitle>
						<CardDescription>
							Transfer funds and close the session (demonstrates createCloseAppSessionMessage)
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="recipient">Recipient Address</Label>
							<Input
								id="recipient"
								placeholder="0x..."
								value={recipientAddress}
								onChange={(e) => setRecipientAddress(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount">Amount (USDC)</Label>
							<Input
								id="amount"
								type="number"
								placeholder="10"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
								min="0.01"
								step="0.01"
							/>
						</div>

						{paymentError && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{paymentError}</AlertDescription>
							</Alert>
						)}

						<Button
							onClick={handlePayment}
							disabled={
								isPaymentProcessing || !recipientAddress || !paymentAmount
							}
							className="w-full"
						>
							{isPaymentProcessing ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing Transfer...
								</>
							) : (
								<>
									<Send className="mr-2 h-4 w-4" />
									Transfer & Close Session
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Payment History */}
			{paymentHistory.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Transfer History</CardTitle>
						<CardDescription>Recent session closures with transfers</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{paymentHistory.map((payment) => (
								<div
									key={payment.id}
									className="flex items-center justify-between rounded border p-2"
								>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-500" />
										<div>
											<p className="font-medium text-sm">
												${payment.amount} to {payment.recipient.slice(0, 6)}...
												{payment.recipient.slice(-4)}
											</p>
											<p className="text-muted-foreground text-xs">
												{new Date(payment.timestamp).toLocaleString()}
											</p>
										</div>
									</div>
									<Badge variant="outline" className="text-xs">
										ID: {payment.id.slice(-6)}
									</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
