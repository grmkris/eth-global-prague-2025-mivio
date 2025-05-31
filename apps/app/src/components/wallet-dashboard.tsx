"use client";

import {
	ArrowDownUp,
	ArrowUpRight,
	CreditCard,
	Plus,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { ChannelStatus } from "~/components/channel-status";
import { PaymentModal } from "~/components/payment-modal";
import { TopUpModal } from "~/components/top-up-modal";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// TODO: Replace with actual wallet client and Nitrolite client from context/props
// These would typically come from your wallet connection provider
const mockWalletAddress = undefined as `0x${string}` | undefined;
const mockWalletClient = undefined;
const mockNitroliteClient = undefined;

type Transaction = {
	id: string;
	type: "payment" | "reward" | "topup";
	amount: string;
	description: string;
	date: string;
};

export function WalletDashboard() {
	const [balance, setBalance] = useState("1,250");
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [showTopUpModal, setShowTopUpModal] = useState(false);

	const [transactions, setTransactions] = useState<Transaction[]>([
		{
			id: "tx-1",
			type: "reward",
			amount: "+50",
			description: "Task Reward: Visit Main Stage",
			date: "Today, 2:30 PM",
		},
		{
			id: "tx-2",
			type: "payment",
			amount: "-200",
			description: "Food Purchase: Burger Combo",
			date: "Today, 1:15 PM",
		},
		{
			id: "tx-3",
			type: "topup",
			amount: "+500",
			description: "Wallet Top-up",
			date: "Today, 11:30 AM",
		},
		{
			id: "tx-4",
			type: "reward",
			amount: "+100",
			description: "Task Reward: Network with Speakers",
			date: "Yesterday, 4:45 PM",
		},
		{
			id: "tx-5",
			type: "payment",
			amount: "-150",
			description: "Merchandise: Event T-shirt",
			date: "Yesterday, 2:20 PM",
		},
	]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Wallet</h1>
				<p className="text-muted-foreground">
					Manage your funds and view transactions
				</p>
			</div>

			<Card className="bg-primary/10 border-primary/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Wallet className="h-5 w-5" />
						Event Balance
					</CardTitle>
					<CardDescription className="text-foreground/70">
						Your available funds for the event
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="font-bold text-4xl">
						{balance} <span className="text-xl">USDC</span>
					</div>
					<p className="mt-1 text-foreground/70 text-sm">EventCoins</p>
				</CardContent>
				<CardFooter className="gap-2">
					<Button
						variant="default"
						className="flex-1"
						onClick={() => setShowPaymentModal(true)}
					>
						<CreditCard className="mr-2 h-4 w-4" />
						Pay
					</Button>
					<Button
						variant="outline"
						className="flex-1"
						onClick={() => setShowTopUpModal(true)}
					>
						<Plus className="mr-2 h-4 w-4" />
						Top Up
					</Button>
				</CardFooter>
			</Card>

			<ChannelStatus
				walletAddress={mockWalletAddress}
				walletClient={mockWalletClient}
				nitroliteClient={mockNitroliteClient}
			/>

			<Tabs defaultValue="all" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="payments">Payments</TabsTrigger>
					<TabsTrigger value="rewards">Rewards</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-4 space-y-4">
					<div className="space-y-3">
						{transactions.map((tx) => (
							<div
								key={tx.id}
								className="flex items-center justify-between rounded-lg border p-3"
							>
								<div className="flex items-center gap-3">
									<div
										className={`rounded-full p-2 ${
											tx.type === "payment"
												? "bg-red-100 text-red-600"
												: tx.type === "reward"
													? "bg-green-100 text-green-600"
													: "bg-blue-100 text-blue-600"
										}`}
									>
										{tx.type === "payment" ? (
											<ArrowUpRight className="h-4 w-4" />
										) : (
											<ArrowDownUp className="h-4 w-4" />
										)}
									</div>
									<div>
										<p className="font-medium">{tx.description}</p>
										<p className="text-muted-foreground text-xs">{tx.date}</p>
									</div>
								</div>
								<div
									className={`font-medium ${tx.type === "payment" ? "text-red-600" : "text-green-600"}`}
								>
									{tx.amount} USDC
								</div>
							</div>
						))}
					</div>
				</TabsContent>

				<TabsContent value="payments" className="mt-4 space-y-4">
					<div className="space-y-3">
						{transactions
							.filter((tx) => tx.type === "payment")
							.map((tx) => (
								<div
									key={tx.id}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div className="flex items-center gap-3">
										<div className="rounded-full bg-red-100 p-2 text-red-600">
											<ArrowUpRight className="h-4 w-4" />
										</div>
										<div>
											<p className="font-medium">{tx.description}</p>
											<p className="text-muted-foreground text-xs">{tx.date}</p>
										</div>
									</div>
									<div className="font-medium text-red-600">{tx.amount} USDC</div>
								</div>
							))}
					</div>
				</TabsContent>

				<TabsContent value="rewards" className="mt-4 space-y-4">
					<div className="space-y-3">
						{transactions
							.filter((tx) => tx.type === "reward" || tx.type === "topup")
							.map((tx) => (
								<div
									key={tx.id}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<div className="flex items-center gap-3">
										<div className="rounded-full bg-green-100 p-2 text-green-600">
											<ArrowDownUp className="h-4 w-4" />
										</div>
										<div>
											<p className="font-medium">{tx.description}</p>
											<p className="text-muted-foreground text-xs">{tx.date}</p>
										</div>
									</div>
									<div className="font-medium text-green-600">
										{tx.amount} USDC
									</div>
								</div>
							))}
					</div>
				</TabsContent>
			</Tabs>

			<PaymentModal
				open={showPaymentModal}
				onClose={() => setShowPaymentModal(false)}
				balance={balance}
				onPayment={(amount) => {
					const newBalance = (
						Number.parseInt(balance.replace(/,/g, "")) - amount
					).toLocaleString();
					setBalance(newBalance);

					const newTx: Transaction = {
						id: `tx-${Date.now()}`,
						type: "payment",
						amount: `-${amount}`,
						description: "Payment",
						date: "Just now",
					};

					setTransactions([newTx, ...transactions]);
					setShowPaymentModal(false);
				}}
			/>

			<TopUpModal
				open={showTopUpModal}
				onClose={() => setShowTopUpModal(false)}
				onTopUp={(amount) => {
					const newBalance = (
						Number.parseInt(balance.replace(/,/g, "")) + amount
					).toLocaleString();
					setBalance(newBalance);

					const newTx: Transaction = {
						id: `tx-${Date.now()}`,
						type: "topup",
						amount: `+${amount}`,
						description: "Wallet Top-up",
						date: "Just now",
					};

					setTransactions([newTx, ...transactions]);
					setShowTopUpModal(false);
				}}
			/>
		</div>
	);
}
