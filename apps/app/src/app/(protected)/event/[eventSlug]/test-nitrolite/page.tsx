"use client";

import { useAccount, useWalletClient } from "wagmi";
import { NitroliteTestDashboard } from "~/components/nitrolite-test-dashboard";

export default function TestNitrolitePage() {
	// Get wallet address and client from wagmi
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();

	return (
		<div className="container mx-auto py-6">
			<NitroliteTestDashboard
				walletAddress={address}
				walletClient={walletClient}
			/>
		</div>
	);
}
