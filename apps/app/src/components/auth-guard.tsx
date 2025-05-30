"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const { address, isConnecting } = useAccount();
	const router = useRouter();

	useEffect(() => {
		if (!address && !isConnecting) {
			router.push("/login");
		}
	}, [address, isConnecting, router]);

	if (isConnecting) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					<p className="text-muted-foreground">Connecting wallet...</p>
				</div>
			</div>
		);
	}

	if (!address) {
		return null;
	}

	return <>{children}</>;
}
