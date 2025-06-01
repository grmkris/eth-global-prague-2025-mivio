"use client";

import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import ConnectButton from "~/components/connect-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

export default function LoginPage() {
	const { address } = useAccount();
	const router = useRouter();

	useEffect(() => {
		if (address) {
			router.push("/events");
		}
	}, [address, router]);

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-background">
			<div className="texture" />
			<Card className="relative z-10 w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<div className="mb-4 flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
							<Wallet className="h-8 w-8 text-primary-foreground" />
						</div>
					</div>
					<CardTitle className="font-bold text-2xl">Welcome to mivio</CardTitle>
					<CardDescription>
						Connect your wallet to access events and start earning rewards
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-4">
					<ConnectButton />
					<p className="text-center text-muted-foreground text-xs">
						By connecting, you agree to our Terms of Service and Privacy Policy
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
