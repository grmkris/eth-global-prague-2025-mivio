"use client";

import { 
	Award,
	Bell, 
	Calendar,
	Camera,
	ChevronRight,
	Copy,
	LogOut, 
	MapPin,
	Settings, 
	Shield, 
	User 
} from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { BottomNavigation } from "~/components/bottom-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { WalletGuard } from "~/components/wallet-guard";

export default function ProfilePage() {
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	const handleCopyAddress = () => {
		if (address) {
			navigator.clipboard.writeText(address);
			// Simple feedback without toast library
			alert("Address copied to clipboard");
		}
	};

	const userStats = {
		eventsAttended: 12,
		totalRewards: 2450,
		achievements: 24,
		joinedDate: "January 2024",
	};

	const settings = [
		{
			icon: Bell,
			title: "Notifications",
			description: "Event updates and rewards",
			action: "switch",
			enabled: true,
		},
		{
			icon: Shield,
			title: "Privacy",
			description: "Manage your data",
			action: "navigate",
		},
		{
			icon: Settings,
			title: "Preferences",
			description: "App settings and display",
			action: "navigate",
		},
	];

	return (
		<WalletGuard>
			<div className="min-h-screen pb-20">
				<div className="p-6">
					<h1 className="mb-6 font-bold text-2xl">Profile</h1>

					{/* Profile Header */}
					<Card className="mb-6">
						<CardContent className="p-6">
							<div className="mb-4 flex items-center gap-4">
								<div className="relative">
									<Avatar className="h-20 w-20">
										<AvatarImage src="/placeholder-avatar.png" />
										<AvatarFallback>
											{address ? address.slice(0, 2).toUpperCase() : "??"}
										</AvatarFallback>
									</Avatar>
									<Button
										size="icon"
										variant="secondary"
										className="absolute right-0 bottom-0 h-8 w-8 rounded-full"
									>
										<Camera className="h-4 w-4" />
									</Button>
								</div>
								<div className="flex-1">
									<h2 className="font-semibold text-lg">
										{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
									</h2>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-2"
										onClick={handleCopyAddress}
									>
										<Copy className="mr-2 h-3 w-3" />
										Copy address
									</Button>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<p className="font-bold text-2xl">{userStats.eventsAttended}</p>
									<p className="text-muted-foreground text-sm">Events</p>
								</div>
								<div className="text-center">
									<p className="font-bold text-2xl">{userStats.totalRewards}</p>
									<p className="text-muted-foreground text-sm">USDC Earned</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Stats Grid */}
					<div className="mb-6 grid grid-cols-2 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="mb-2 flex items-center gap-2">
									<Award className="h-4 w-4 text-primary" />
									<p className="font-medium text-sm">Achievements</p>
								</div>
								<p className="font-bold text-xl">{userStats.achievements}</p>
								<p className="text-muted-foreground text-xs">Unlocked</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="mb-2 flex items-center gap-2">
									<Calendar className="h-4 w-4 text-primary" />
									<p className="font-medium text-sm">Member Since</p>
								</div>
								<p className="font-bold text-sm">{userStats.joinedDate}</p>
							</CardContent>
						</Card>
					</div>

					{/* Settings */}
					<Card className="mb-6">
						<CardHeader>
							<CardTitle className="text-base">Settings</CardTitle>
						</CardHeader>
						<CardContent className="space-y-1">
							{settings.map((setting) => (
								<div
									key={setting.title}
									className="flex items-center justify-between border-b py-3 last:border-0"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
											<setting.icon className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="font-medium">{setting.title}</p>
											<p className="text-muted-foreground text-sm">
												{setting.description}
											</p>
										</div>
									</div>
									{setting.action === "switch" ? (
										<Switch defaultChecked={setting.enabled} />
									) : (
										<ChevronRight className="h-5 w-5 text-muted-foreground" />
									)}
								</div>
							))}
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
						</CardHeader>
						<CardContent>
							<Button
								variant="destructive"
								className="w-full"
								onClick={() => disconnect()}
							>
								<LogOut className="mr-2 h-4 w-4" />
								Disconnect Wallet
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
			<BottomNavigation />
		</WalletGuard>
	);
} 