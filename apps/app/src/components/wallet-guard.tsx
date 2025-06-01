"use client";

import { Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

interface WalletGuardProps {
	children: React.ReactNode;
}

export function WalletGuard({ children }: WalletGuardProps) {
	const { isConnected } = useAccount();

	if (!isConnected) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-4 text-center">
						<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
							<Wallet className="h-10 w-10 text-primary" />
						</div>
						<CardTitle className="text-2xl">Welcome to mivio</CardTitle>
						<CardDescription className="text-base">
							Connect your wallet to access events, earn rewards, and join the
							community
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex justify-center">
							<w3m-button />
						</div>
						<div className="text-center text-muted-foreground text-sm">
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
