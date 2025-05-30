"use client";

import type { NitroliteClient } from "@erc7824/nitrolite";
import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	RefreshCw,
	Shield,
	XCircle,
} from "lucide-react";
import type { WalletClient } from "viem";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useEventChannelSimple } from "~/hooks/nitrolite/useEventChannelSimple";

interface ChannelStatusProps {
	walletAddress: `0x${string}` | undefined;
	walletClient: WalletClient | undefined;
	nitroliteClient: NitroliteClient | undefined;
}

export function ChannelStatus({
	walletAddress,
	walletClient,
	nitroliteClient,
}: ChannelStatusProps) {
	const {
		channelId,
		isChannelOpen,
		offchainBalance,
		isLoading,
		error,
		createChannel,
		updateBalance,
	} = useEventChannelSimple({ walletAddress, walletClient, nitroliteClient });

	// Status icon and color
	const getStatusIcon = () => {
		if (isLoading) {
			return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
		}
		if (error) {
			return <XCircle className="h-5 w-5 text-red-500" />;
		}
		if (isChannelOpen) {
			return <CheckCircle2 className="h-5 w-5 text-green-500" />;
		}
		return <Shield className="h-5 w-5 text-gray-400" />;
	};

	const getStatusText = () => {
		if (isLoading) return "Initializing...";
		if (error) return "Connection Failed";
		if (isChannelOpen) return "Connected";
		return "No Channel";
	};

	const getStatusColor = () => {
		if (error) return "destructive";
		if (isChannelOpen) return "default";
		return "secondary";
	};

	return (
		<Card className="mb-6">
			<CardContent className="pt-6">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{getStatusIcon()}
						<div>
							<h3 className="font-semibold">Payment Channel</h3>
							<p className="text-muted-foreground text-sm">
								Off-chain payment status
							</p>
						</div>
					</div>
					<Badge variant={getStatusColor()}>{getStatusText()}</Badge>
				</div>

				{/* Balance Display */}
				{isChannelOpen && (
					<div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-sm">
								Off-chain Balance
							</span>
							<span className="font-bold text-2xl">${offchainBalance}</span>
						</div>
						<Button
							size="sm"
							variant="ghost"
							onClick={updateBalance}
							className="mt-2 w-full"
						>
							Refresh Balance
						</Button>
					</div>
				)}

				{/* Error Display */}
				{error && (
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Action Buttons */}
				{!channelId && !isLoading && (
					<div className="space-y-3">
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								A payment channel is required for off-chain transactions. This
								enables instant, gas-free payments within the event.
							</AlertDescription>
						</Alert>
						<Button
							onClick={createChannel}
							disabled={
								isLoading || !walletAddress || !walletClient || !nitroliteClient
							}
							className="w-full"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Setting up channel...
								</>
							) : (
								<>
									<Shield className="mr-2 h-4 w-4" />
									Create Payment Channel
								</>
							)}
						</Button>
					</div>
				)}

				{/* Connection Info */}
				{isChannelOpen && (
					<div className="mt-4 text-muted-foreground text-xs">
						<p>• Instant transactions enabled</p>
						<p>• No gas fees for payments</p>
						<p>• Funds are secure and withdrawable</p>
					</div>
				)}

				{/* Retry Button for Failed State */}
				{error && (
					<Button
						onClick={createChannel}
						disabled={isLoading}
						variant="outline"
						className="mt-4 w-full"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry Connection
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
