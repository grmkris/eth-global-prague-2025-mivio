"use client";

import {
	Bell,
	ChevronRight,
	HelpCircle,
	LogOut,
	Settings,
	Shield,
	Sparkles,
	Trophy,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { BottomNavigation } from "~/components/bottom-navigation";
import { Card, CardContent } from "~/components/ui/card";
import { WalletGuard } from "~/components/wallet-guard";

export default function MorePage() {
	const router = useRouter();
	const { disconnect } = useDisconnect();

	const menuItems = [
		{
			icon: User,
			title: "Profile",
			subtitle: "View and edit your profile",
			href: "/profile",
		},
		{
			icon: Trophy,
			title: "Achievements",
			subtitle: "Badges and rewards",
			href: "/achievements",
		},
		{
			icon: Sparkles,
			title: "Events",
			subtitle: "Browse all events",
			href: "/events",
		},
		{
			icon: Bell,
			title: "Notifications",
			subtitle: "Manage your alerts",
			href: "/notifications",
		},
		{
			icon: Settings,
			title: "Settings",
			subtitle: "App preferences",
			href: "/settings",
		},
		{
			icon: Shield,
			title: "Privacy & Security",
			subtitle: "Manage your data",
			href: "/privacy",
		},
		{
			icon: HelpCircle,
			title: "Help & Support",
			subtitle: "Get assistance",
			href: "/help",
		},
	];

	const handleMenuClick = (href: string) => {
		router.push(href);
	};

	return (
		<WalletGuard>
			<div className="min-h-screen bg-background pb-20">
				<div className="p-4">
					<h1 className="mb-6 font-bold text-2xl">More</h1>

					<div className="space-y-2">
						{menuItems.map((item, index) => (
							<Card
								key={item.title}
								className="cursor-pointer transition-colors hover:bg-muted/50"
								onClick={() => handleMenuClick(item.href)}
							>
								<CardContent className="flex items-center justify-between p-4">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
											<item.icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium">{item.title}</p>
											<p className="text-muted-foreground text-sm">
												{item.subtitle}
											</p>
										</div>
									</div>
									<ChevronRight className="h-5 w-5 text-muted-foreground" />
								</CardContent>
							</Card>
						))}

						{/* Logout Card */}
						<Card
							className="mt-4 cursor-pointer transition-colors hover:bg-destructive/10"
							onClick={() => disconnect()}
						>
							<CardContent className="flex items-center justify-between p-4">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
										<LogOut className="h-5 w-5 text-destructive" />
									</div>
									<div>
										<p className="font-medium text-destructive">
											Disconnect Wallet
										</p>
										<p className="text-muted-foreground text-sm">
											Sign out of your account
										</p>
									</div>
								</div>
								<ChevronRight className="h-5 w-5 text-muted-foreground" />
							</CardContent>
						</Card>
					</div>

					{/* App Version */}
					<div className="mt-8 text-center">
						<p className="text-muted-foreground text-sm">Mivio v1.0.0</p>
					</div>
				</div>
			</div>
			<BottomNavigation />
		</WalletGuard>
	);
}
