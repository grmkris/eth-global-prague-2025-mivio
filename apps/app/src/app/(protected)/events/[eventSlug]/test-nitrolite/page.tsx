"use client";

import { useParams } from "next/navigation";
import { useAccount, useWalletClient } from "wagmi";
import { NitroliteTestDashboard } from "~/components/nitrolite-test-dashboard";

export default function TestNitrolitePage() {
	const { eventSlug } = useParams();

	// Get wallet address and client from wagmi
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();

	if (!eventSlug || !address || !walletClient) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto py-6">
			<NitroliteTestDashboard
				eventSlug={eventSlug as string}
				walletAddress={address}
				walletClient={walletClient}
			/>
		</div>
	);
}
