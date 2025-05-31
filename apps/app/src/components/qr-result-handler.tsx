"use client";

import {
	AlertCircle,
	CheckCircle2,
	MapPin,
	ShoppingBag,
	Trophy,
	X,
} from "lucide-react";
import { useState } from "react";
import { PaymentModal } from "~/components/payment-modal";
import { RewardModal } from "~/components/reward-modal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

type Reward = {
	title: string;
	reward: string;
	rewardType: "token" | "badge" | "perk";
};

type QRData = {
	type: "task" | "payment" | "checkin" | "unknown";
	taskId?: string;
	itemId?: string;
	amount?: number;
	vendor?: string;
	locationId?: string;
	points?: number;
	eventSlug?: string;
	description?: string;
};

interface QRResultHandlerProps {
	qrData: string;
	onClose: () => void;
	onSuccess: () => void;
}

export function QRResultHandler({
	qrData,
	onClose,
	onSuccess,
}: QRResultHandlerProps) {
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [showRewardModal, setShowRewardModal] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentReward, setCurrentReward] = useState<Reward | null>(null);

	// Parse QR data
	const parseQRData = (data: string): QRData => {
		try {
			const parsed = JSON.parse(data);
			return { type: "unknown", ...parsed };
		} catch {
			// If it's not JSON, try to detect the format
			if (data.startsWith("task:")) {
				return {
					type: "task",
					taskId: data.replace("task:", ""),
				};
			}
			if (data.startsWith("pay:")) {
				const [, itemId, amount] = data.split(":");
				if (!itemId || !amount) {
					return { type: "unknown" };
				}
				return {
					type: "payment",
					itemId,
					amount: Number.parseInt(amount),
				};
			}
			return { type: "unknown" };
		}
	};

	const parsedData = parseQRData(qrData);

	const handleTaskCompletion = async () => {
		if (!parsedData.taskId) return;

		setIsProcessing(true);

		// Simulate API call to complete task
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Mock task data
		const taskReward = {
			title: `Task: ${parsedData.taskId}`,
			reward: "50 EventCoins",
			rewardType: "token" as const,
		};

		setCurrentReward(taskReward);
		setShowRewardModal(true);
		setIsProcessing(false);
	};

	const handleCheckin = async () => {
		if (!parsedData.locationId) return;

		setIsProcessing(true);

		// Simulate API call for check-in
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const checkinReward = {
			title: `Check-in: ${parsedData.locationId}`,
			reward: `${parsedData.points || 25} EventCoins`,
			rewardType: "token" as const,
		};

		setCurrentReward(checkinReward);
		setShowRewardModal(true);
		setIsProcessing(false);
	};

	const handlePayment = () => {
		setShowPaymentModal(true);
	};

	const getIcon = () => {
		switch (parsedData.type) {
			case "task":
				return <CheckCircle2 className="h-8 w-8 text-green-500" />;
			case "payment":
				return <ShoppingBag className="h-8 w-8 text-blue-500" />;
			case "checkin":
				return <MapPin className="h-8 w-8 text-purple-500" />;
			default:
				return <AlertCircle className="h-8 w-8 text-yellow-500" />;
		}
	};

	const getTitle = () => {
		switch (parsedData.type) {
			case "task":
				return "Task QR Code";
			case "payment":
				return "Payment QR Code";
			case "checkin":
				return "Check-in QR Code";
			default:
				return "Unknown QR Code";
		}
	};

	const getDescription = () => {
		switch (parsedData.type) {
			case "task":
				return `Complete task: ${parsedData.taskId}`;
			case "payment":
				return `Pay for: ${parsedData.itemId || "Item"} - ${parsedData.amount} USDC`;
			case "checkin":
				return `Check in at: ${parsedData.locationId}`;
			default:
				return "Unable to process this QR code";
		}
	};

	const canProcess = parsedData.type !== "unknown";

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{getIcon()}
							<div>
								<CardTitle>{getTitle()}</CardTitle>
								<CardDescription>{getDescription()}</CardDescription>
							</div>
						</div>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* QR Data Display */}
					<div className="rounded-lg bg-muted p-3">
						<p className="mb-1 text-muted-foreground text-xs">QR Code Data:</p>
						<p className="break-all font-mono text-sm">{qrData}</p>
					</div>

					{/* Parsed Data */}
					{canProcess && (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Badge
									variant={
										parsedData.type === "task"
											? "default"
											: parsedData.type === "payment"
												? "secondary"
												: "outline"
									}
								>
									{parsedData.type.toUpperCase()}
								</Badge>
								{parsedData.eventSlug && (
									<Badge variant="outline">{parsedData.eventSlug}</Badge>
								)}
							</div>

							{parsedData.type === "task" && (
								<div className="space-y-2">
									<p className="text-sm">
										<strong>Task ID:</strong> {parsedData.taskId}
									</p>
									<p className="text-muted-foreground text-sm">
										Complete this task to earn EventCoins and progress your
										level
									</p>
								</div>
							)}

							{parsedData.type === "payment" && (
								<div className="space-y-2">
									<p className="text-sm">
										<strong>Item:</strong> {parsedData.itemId}
									</p>
									<p className="text-sm">
										<strong>Amount:</strong> {parsedData.amount} USDC
									</p>
									{parsedData.vendor && (
										<p className="text-sm">
											<strong>Vendor:</strong> {parsedData.vendor}
										</p>
									)}
								</div>
							)}

							{parsedData.type === "checkin" && (
								<div className="space-y-2">
									<p className="text-sm">
										<strong>Location:</strong> {parsedData.locationId}
									</p>
									<p className="text-sm">
										<strong>Points:</strong> +{parsedData.points || 25} USDC
									</p>
									<p className="text-muted-foreground text-sm">
										Check in to earn points and track your event participation
									</p>
								</div>
							)}
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-2 pt-2">
						<Button variant="outline" onClick={onClose} className="flex-1">
							Cancel
						</Button>

						{canProcess && (
							<>
								{parsedData.type === "task" && (
									<Button
										onClick={handleTaskCompletion}
										disabled={isProcessing}
										className="flex-1"
									>
										{isProcessing ? "Completing..." : "Complete Task"}
									</Button>
								)}

								{parsedData.type === "payment" && (
									<Button
										onClick={handlePayment}
										disabled={isProcessing}
										className="flex-1"
									>
										Pay Now
									</Button>
								)}

								{parsedData.type === "checkin" && (
									<Button
										onClick={handleCheckin}
										disabled={isProcessing}
										className="flex-1"
									>
										{isProcessing ? "Checking in..." : "Check In"}
									</Button>
								)}
							</>
						)}

						{!canProcess && (
							<Button disabled className="flex-1">
								Cannot Process
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Payment Modal */}
			{showPaymentModal && parsedData.type === "payment" && (
				<PaymentModal
					open={showPaymentModal}
					onClose={() => setShowPaymentModal(false)}
					balance="2,450"
					onPayment={(amount) => {
						setShowPaymentModal(false);
						onSuccess();
					}}
				/>
			)}

			{/* Reward Modal */}
			{showRewardModal && currentReward && (
				<RewardModal
					reward={currentReward}
					open={showRewardModal}
					onClose={() => {
						setShowRewardModal(false);
						onSuccess();
					}}
				/>
			)}
		</div>
	);
}
