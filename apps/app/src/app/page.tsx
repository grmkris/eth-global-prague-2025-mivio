"use client";

import { HomeDashboard } from "~/components/home-dashboard";
import { WalletGuard } from "~/components/wallet-guard";
import { BottomNavigation } from "~/components/bottom-navigation";

export default function RootPage() {
	return (
		<WalletGuard>
			<HomeDashboard />
			<BottomNavigation />
		</WalletGuard>
	);
}
