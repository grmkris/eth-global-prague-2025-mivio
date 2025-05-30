"use client";

import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

type TopUpModalProps = {
	open: boolean;
	onClose: () => void;
	onTopUp: (amount: number) => void;
};

export function TopUpModal({ open, onClose, onTopUp }: TopUpModalProps) {
	const [amount, setAmount] = useState("500");
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [isProcessing, setIsProcessing] = useState(false);

	const handleTopUp = () => {
		setIsProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			onTopUp(Number.parseInt(amount));
			setIsProcessing(false);
		}, 1500);
	};

	const isAmountValid = Number.parseInt(amount) > 0;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Top Up Your Wallet</DialogTitle>
					<DialogDescription>Add funds to your event wallet</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="topup-amount">Amount (EventCoins)</Label>
						<Input
							id="topup-amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
						/>
						<div className="mt-1 flex gap-2">
							{[100, 500, 1000].map((quickAmount) => (
								<Button
									key={quickAmount}
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setAmount(quickAmount.toString())}
								>
									{quickAmount}
								</Button>
							))}
						</div>
					</div>

					<div className="grid gap-2">
						<Label>Payment Method</Label>
						<RadioGroup
							defaultValue="card"
							value={paymentMethod}
							onValueChange={setPaymentMethod}
							className="grid grid-cols-3 gap-2"
						>
							<div>
								<RadioGroupItem
									value="card"
									id="card"
									className="peer sr-only"
								/>
								<Label
									htmlFor="card"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									<CreditCard className="mb-3 h-6 w-6" />
									Card
								</Label>
							</div>

							<div>
								<RadioGroupItem
									value="bank"
									id="bank"
									className="peer sr-only"
								/>
								<Label
									htmlFor="bank"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									<Landmark className="mb-3 h-6 w-6" />
									Bank
								</Label>
							</div>

							<div>
								<RadioGroupItem
									value="mobile"
									id="mobile"
									className="peer sr-only"
								/>
								<Label
									htmlFor="mobile"
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
								>
									<Smartphone className="mb-3 h-6 w-6" />
									Mobile
								</Label>
							</div>
						</RadioGroup>
					</div>

					{paymentMethod === "card" && (
						<div className="grid gap-2">
							<Label htmlFor="card-number">Card Number</Label>
							<Input id="card-number" placeholder="•••• •••• •••• ••••" />
							<div className="grid grid-cols-3 gap-2">
								<div>
									<Label htmlFor="expiry">Expiry</Label>
									<Input id="expiry" placeholder="MM/YY" />
								</div>
								<div>
									<Label htmlFor="cvc">CVC</Label>
									<Input id="cvc" placeholder="•••" />
								</div>
								<div>
									<Label htmlFor="zip">ZIP</Label>
									<Input id="zip" placeholder="12345" />
								</div>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={handleTopUp}
						disabled={!isAmountValid || isProcessing}
					>
						{isProcessing ? "Processing..." : "Top Up"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
