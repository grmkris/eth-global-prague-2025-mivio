"use client";

import { 
	User, 
	Settings, 
	Bell, 
	Shield, 
	LogOut, 
	ChevronRight,
	Copy,
	Camera,
	Award,
	Calendar,
	MapPin
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { WalletGuard } from "~/components/wallet-guard";
import { BottomNavigation } from "~/components/bottom-navigation";
import { useAccount, useDisconnect } from "wagmi";

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
		totalRewards: 2,450,
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
					<h1 className="font-bold text-2xl mb-6">Profile</h1>

					{/* Profile Header */}
					<Card className="mb-6">
						<CardContent className="p-6">
							<div className="flex items-center gap-4 mb-4">
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
										className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
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
									<p className="text-2xl font-bold">{userStats.eventsAttended}</p>
									<p className="text-sm text-muted-foreground">Events</p>
								</div>
								<div className="text-center">
									<p className="text-2xl font-bold">{userStats.totalRewards}</p>
									<p className="text-sm text-muted-foreground">USDC Earned</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Stats Grid */}
					<div className="grid grid-cols-2 gap-4 mb-6">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-2">
									<Award className="h-4 w-4 text-primary" />
									<p className="text-sm font-medium">Achievements</p>
								</div>
								<p className="text-xl font-bold">{userStats.achievements}</p>
								<p className="text-xs text-muted-foreground">Unlocked</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center gap-2 mb-2">
									<Calendar className="h-4 w-4 text-primary" />
									<p className="text-sm font-medium">Member Since</p>
								</div>
								<p className="text-sm font-bold">{userStats.joinedDate}</p>
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
									className="flex items-center justify-between py-3 border-b last:border-0"
								>
									<div className="flex items-center gap-3">
										<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
											<setting.icon className="h-5 w-5 text-muted-foreground" />
										</div>
										<div>
											<p className="font-medium">{setting.title}</p>
											<p className="text-sm text-muted-foreground">
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