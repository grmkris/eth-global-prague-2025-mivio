"use client";

import {
	ArrowLeft,
	Calculator,
	CreditCard,
	DollarSign,
	QrCode,
	Receipt,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QRCodeGenerator } from "~/components/qr-code-generator";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type Transaction = {
	id: string;
	amount: number;
	description: string;
	vendor: string;
	timestamp: Date;
	status: "pending" | "paid" | "cancelled";
};

export default function AdminPOSPage() {
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [vendor, setVendor] = useState("Coffee Vendor");
	const [showQRModal, setShowQRModal] = useState(false);
	const [currentTransaction, setCurrentTransaction] =
		useState<Transaction | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([
		{
			id: "txn-1",
			amount: 200,
			description: "Specialty coffee flight",
			vendor: "Tasting Bar",
			timestamp: new Date(Date.now() - 30 * 60000),
			status: "paid",
		},
		{
			id: "txn-2",
			amount: 150,
			description: "Coffee brewing kit",
			vendor: "Equipment Shop",
			timestamp: new Date(Date.now() - 45 * 60000),
			status: "paid",
		},
		{
			id: "txn-3",
			amount: 350,
			description: "Barista masterclass ticket",
			vendor: "Workshop Center",
			timestamp: new Date(Date.now() - 60 * 60000),
			status: "pending",
		},
	]);

	const quickAmounts = [50, 100, 150, 200, 250, 300, 500, 1000];

	const generatePaymentQR = () => {
		const amountValue = Number.parseInt(amount);
		if (!amountValue || amountValue <= 0) return;

		const transaction: Transaction = {
			id: `txn-${Date.now()}`,
			amount: amountValue,
			description: description || `Payment of ${amountValue} EC`,
			vendor: vendor,
			timestamp: new Date(),
			status: "pending",
		};

		setCurrentTransaction(transaction);
		setTransactions((prev) => [transaction, ...prev]);
		setShowQRModal(true);
	};

	const getQRData = (transaction: Transaction) => {
		return JSON.stringify({
			type: "payment",
			transactionId: transaction.id,
			amount: transaction.amount,
			vendor: transaction.vendor,
			eventSlug: "coffee-festival-2025",
			description: transaction.description,
		});
	};

	const clearForm = () => {
		setAmount("");
		setDescription("");
	};

	const addQuickAmount = (value: number) => {
		setAmount(value.toString());
	};

	const appendToAmount = (value: string) => {
		if (value === "." && amount.includes(".")) return;
		if (amount === "0" && value !== ".") {
			setAmount(value);
		} else {
			setAmount((prev) => prev + value);
		}
	};

	const deleteLastChar = () => {
		setAmount((prev) => prev.slice(0, -1));
	};

	const todaysRevenue = transactions
		.filter(
			(t) =>
				t.status === "paid" &&
				new Date(t.timestamp).toDateString() === new Date().toDateString(),
		)
		.reduce((sum, t) => sum + t.amount, 0);

	const pendingTransactions = transactions.filter(
		(t) => t.status === "pending",
	);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-4">
						<Link href="/admin">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">POS System</h1>
							<p className="text-muted-foreground">
								Point of sale with custom amount QR generation
							</p>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="text-center">
							<p className="font-bold text-2xl">
								{todaysRevenue.toLocaleString()} EC
							</p>
							<p className="text-muted-foreground text-sm">Today's Revenue</p>
						</div>
						<div className="text-center">
							<p className="font-bold text-2xl">{pendingTransactions.length}</p>
							<p className="text-muted-foreground text-sm">Pending Payments</p>
						</div>
						<div className="text-center">
							<p className="font-bold text-2xl">
								{transactions.filter((t) => t.status === "paid").length}
							</p>
							<p className="text-muted-foreground text-sm">Completed Today</p>
						</div>
					</div>
				</div>

				<div className="grid gap-8 lg:grid-cols-2">
					{/* POS Interface */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calculator className="h-5 w-5" />
									Create Payment
								</CardTitle>
								<CardDescription>
									Enter custom amount and generate QR code for payment
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Amount Display */}
								<div className="text-center">
									<Label htmlFor="amount" className="text-lg">
										Amount (EventCoins)
									</Label>
									<div className="mt-2 rounded-lg border-2 border-primary/20 bg-muted/30 p-4">
										<div className="flex items-center justify-center gap-2">
											<DollarSign className="h-6 w-6 text-primary" />
											<span className="font-bold font-mono text-3xl">
												{amount || "0"} EC
											</span>
										</div>
									</div>
								</div>

								{/* Quick Amount Buttons */}
								<div>
									<Label className="text-sm">Quick Amounts</Label>
									<div className="mt-2 grid grid-cols-4 gap-2">
										{quickAmounts.map((amt) => (
											<Button
												key={amt}
												variant="outline"
												size="sm"
												onClick={() => addQuickAmount(amt)}
											>
												{amt} EC
											</Button>
										))}
									</div>
								</div>

								{/* Calculator Keypad */}
								<div>
									<Label className="text-sm">Number Pad</Label>
									<div className="mt-2 grid grid-cols-3 gap-2">
										{[
											"1",
											"2",
											"3",
											"4",
											"5",
											"6",
											"7",
											"8",
											"9",
											"0",
											".",
											"⌫",
										].map((key) => (
											<Button
												key={key}
												variant="outline"
												onClick={() => {
													if (key === "⌫") {
														deleteLastChar();
													} else {
														appendToAmount(key);
													}
												}}
												className={
													key === "⌫" ? "bg-red-50 hover:bg-red-100" : ""
												}
											>
												{key === "⌫" ? <Trash2 className="h-4 w-4" /> : key}
											</Button>
										))}
									</div>
								</div>

								{/* Description */}
								<div className="space-y-2">
									<Label htmlFor="description">Description (Optional)</Label>
									<Textarea
										id="description"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="Enter payment description..."
										rows={2}
									/>
								</div>

								{/* Vendor */}
								<div className="space-y-2">
									<Label htmlFor="vendor">Vendor Name</Label>
									<Input
										id="vendor"
										value={vendor}
										onChange={(e) => setVendor(e.target.value)}
										placeholder="Enter vendor name..."
									/>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<Button
										onClick={generatePaymentQR}
										disabled={!amount || Number.parseInt(amount) <= 0}
										className="flex-1"
									>
										<QrCode className="mr-2 h-4 w-4" />
										Generate Payment QR
									</Button>
									<Button variant="outline" onClick={clearForm}>
										Clear
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Transaction History */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Receipt className="h-5 w-5" />
									Recent Transactions
								</CardTitle>
								<CardDescription>
									Latest payment requests and completed transactions
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{transactions.slice(0, 8).map((transaction) => (
										<div
											key={transaction.id}
											className="flex items-center justify-between rounded-lg border p-3"
										>
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{transaction.amount} EC
													</span>
													<Badge
														variant={
															transaction.status === "paid"
																? "default"
																: transaction.status === "pending"
																	? "secondary"
																	: "destructive"
														}
													>
														{transaction.status}
													</Badge>
												</div>
												<p className="text-muted-foreground text-sm">
													{transaction.description}
												</p>
												<p className="text-muted-foreground text-xs">
													{transaction.vendor} •{" "}
													{transaction.timestamp.toLocaleTimeString()}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* QR Code Modal */}
				{currentTransaction && (
					<QRCodeGenerator
						data={getQRData(currentTransaction)}
						title={`Payment Request: ${currentTransaction.amount} EC`}
						description={`${currentTransaction.vendor} - ${currentTransaction.description}`}
						open={showQRModal}
						onClose={() => setShowQRModal(false)}
					/>
				)}
			</div>
		</div>
	);
}
