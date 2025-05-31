"use client";

import { Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface WalletGuardProps {
	children: React.ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
	const { isConnected } = useAccount();

	if (!isConnected) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background p-4">
				<Card className="max-w-md w-full">
					<CardHeader className="text-center space-y-4">
						<div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
							<Wallet className="h-10 w-10 text-primary" />
						</div>
						<CardTitle className="text-2xl">Welcome to Mivio</CardTitle>
						<CardDescription className="text-base">
							Connect your wallet to access events, earn rewards, and join the community
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<w3m-button />
						<div className="text-center text-sm text-muted-foreground">
							<p>By connecting, you agree to our</p>
							<p className="underline">Terms of Service and Privacy Policy</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return <>{children}</>;
} 