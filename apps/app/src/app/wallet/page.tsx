"use client";

import { ArrowDownLeft, ArrowUpRight, Send, Wallet, Zap } from "lucide-react";
import { useAccount } from "wagmi";
import { BottomNavigation } from "~/components/bottom-navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WalletGuard } from "~/components/wallet-guard";

export default function WalletPage() {
	const { address } = useAccount();

	const transactions = [
		{
			id: 1,
			type: "received",
			description: "Task Reward - Main Stage Visit",
			amount: 50,
			date: "2025-01-20T10:30:00",
			status: "completed",
		},
		{
			id: 2,
			type: "sent",
			description: "Purchase - Coffee & Pastry",
			amount: 120,
			date: "2025-01-20T09:15:00",
			status: "completed",
		},
		{
			id: 3,
			type: "received",
			description: "Check-in Bonus",
			amount: 25,
			date: "2025-01-19T14:00:00",
			status: "completed",
		},
		{
			id: 4,
			type: "sent",
			description: "Merchandise Purchase",
			amount: 250,
			date: "2025-01-19T12:30:00",
			status: "completed",
		},
		{
			id: 5,
			type: "received",
			description: "Achievement Unlocked",
			amount: 100,
			date: "2025-01-18T16:45:00",
			status: "completed",
		},
	];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return `Today, ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})}`;
		} else if (date.toDateString() === yesterday.toDateString()) {
			return `Yesterday, ${date.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			})}`;
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		}
	};

	return (
		<WalletGuard>
			<div className="min-h-screen pb-20">
				<div className="p-6">
					<h1 className="mb-6 font-bold text-2xl">Wallet</h1>

					{/* Balance Card */}
					<Card className="mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
						<CardHeader>
							<CardDescription>Event Coins Balance</CardDescription>
							<CardTitle className="flex items-center gap-2 font-bold text-4xl">
								<Zap className="h-8 w-8 text-primary" />
								2,450
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex gap-2">
								<Button size="sm" className="flex-1">
									<Send className="mr-2 h-4 w-4" />
									Send
								</Button>
								<Button size="sm" variant="outline" className="flex-1">
									<ArrowDownLeft className="mr-2 h-4 w-4" />
									Receive
								</Button>
							</div>
							{address && (
								<p className="mt-4 text-muted-foreground text-xs">
									{address.slice(0, 6)}...{address.slice(-4)}
								</p>
							)}
						</CardContent>
					</Card>

					{/* Quick Stats */}
					<div className="mb-6 grid grid-cols-2 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-sm">
											Earned Today
										</p>
										<p className="font-bold text-green-600 text-xl">+175</p>
									</div>
									<ArrowDownLeft className="h-5 w-5 text-green-600" />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-sm">Spent Today</p>
										<p className="font-bold text-red-600 text-xl">-370</p>
									</div>
									<ArrowUpRight className="h-5 w-5 text-red-600" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Transaction History */}
					<Tabs defaultValue="all" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="received">Received</TabsTrigger>
							<TabsTrigger value="sent">Sent</TabsTrigger>
						</TabsList>

						<TabsContent value="all" className="mt-4 space-y-3">
							{transactions.map((tx) => (
								<Card key={tx.id}>
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div
													className={`flex h-10 w-10 items-center justify-center rounded-full ${
														tx.type === "received"
															? "bg-green-100"
															: "bg-red-100"
													}`}
												>
													{tx.type === "received" ? (
														<ArrowDownLeft className="h-5 w-5 text-green-600" />
													) : (
														<ArrowUpRight className="h-5 w-5 text-red-600" />
													)}
												</div>
												<div>
													<p className="font-medium">{tx.description}</p>
													<p className="text-muted-foreground text-xs">
														{formatDate(tx.date)}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p
													className={`font-bold ${
														tx.type === "received"
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{tx.type === "received" ? "+" : "-"}
													{tx.amount} USDC
												</p>
												<Badge variant="outline" className="text-xs">
													{tx.status}
												</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</TabsContent>

						<TabsContent value="received" className="mt-4 space-y-3">
							{transactions
								.filter((tx) => tx.type === "received")
								.map((tx) => (
									<Card key={tx.id}>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
														<ArrowDownLeft className="h-5 w-5 text-green-600" />
													</div>
													<div>
														<p className="font-medium">{tx.description}</p>
														<p className="text-muted-foreground text-xs">
															{formatDate(tx.date)}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="font-bold text-green-600">
														+{tx.amount} USDC
													</p>
													<Badge variant="outline" className="text-xs">
														{tx.status}
													</Badge>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
						</TabsContent>

						<TabsContent value="sent" className="mt-4 space-y-3">
							{transactions
								.filter((tx) => tx.type === "sent")
								.map((tx) => (
									<Card key={tx.id}>
										<CardContent className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
														<ArrowUpRight className="h-5 w-5 text-red-600" />
													</div>
													<div>
														<p className="font-medium">{tx.description}</p>
														<p className="text-muted-foreground text-xs">
															{formatDate(tx.date)}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="font-bold text-red-600">
														-{tx.amount} USDC
													</p>
													<Badge variant="outline" className="text-xs">
														{tx.status}
													</Badge>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
						</TabsContent>
					</Tabs>
				</div>
			</div>
			<BottomNavigation />
		</WalletGuard>
	);
}
