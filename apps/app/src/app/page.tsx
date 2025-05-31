"use client";

import { BottomNavigation } from "~/components/bottom-navigation";
import { HomeDashboard } from "~/components/home-dashboard";
import { WalletGuard } from "~/components/wallet-guard";

export default function RootPage() {
	return (
		<WalletGuard>
			<HomeDashboard />
			<BottomNavigation />
		</WalletGuard>
	);
}
