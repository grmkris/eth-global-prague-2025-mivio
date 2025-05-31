"use client";

import { CheckCircle2, Mail, MapPin, QrCode, Trophy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RewardModal } from "~/components/reward-modal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useEmailProofVerification } from "~/hooks/useEmailProofVerification";

type Task = {
	id: string;
	title: string;
	description: string;
	location: string;
	reward: string;
	rewardType: "token" | "badge" | "perk";
	progress: number;
	completed: boolean;
	type: "visit" | "scan" | "interact" | "verify";
};

export function MicrotaskDashboard() {
	const router = useRouter();
	const params = useParams();
	const eventSlug = params.eventSlug as string;

	const [showEmailModal, setShowEmailModal] = useState(false);
	const [emailFile, setEmailFile] = useState<string>("");
	const { startProving, verificationError, onChainVerificationStatus } =
		useEmailProofVerification();

	const [tasks, setTasks] = useState<Task[]>([
		{
			id: "task-0",
			title: "Verify Ticket Ownership",
			description:
				"Prove you own a valid ticket using zero-knowledge email verification",
			location: "Digital Verification",
			reward: "VIP Access Badge",
			rewardType: "badge",
			progress: 0,
			completed: false,
			type: "verify",
		},
		{
			id: "task-1",
			title: "Visit Tasting Hall",
			description:
				"Explore the main coffee tasting area and sample different origins",
			location: "Tasting Hall - Main Pavilion",
			reward: "50 EventCoins",
			rewardType: "token",
			progress: 0,
			completed: false,
			type: "visit",
		},
		{
			id: "task-2",
			title: "Scan Roaster's QR",
			description:
				"Visit a coffee roaster's booth and scan their special blend QR code",
			location: "Roaster Row - Exhibition Hall",
			reward: "Coffee Expert Badge",
			rewardType: "badge",
			progress: 0,
			completed: false,
			type: "scan",
		},
		{
			id: "task-3",
			title: "Attend Latte Art Workshop",
			description: "Join the interactive latte art demonstration",
			location: "Barista Stage - East Wing",
			reward: "Free Coffee Voucher",
			rewardType: "perk",
			progress: 0,
			completed: false,
			type: "interact",
		},
		{
			id: "task-4",
			title: "Coffee Cupping Session",
			description: "Participate in at least 3 coffee cupping sessions",
			location: "Cupping Lab - North Wing",
			reward: "100 EventCoins",
			rewardType: "token",
			progress: 33,
			completed: false,
			type: "interact",
		},
		{
			id: "task-5",
			title: "Brewing Demo",
			description: "Watch the pour-over brewing demonstration",
			location: "Demo Stage - Hall B",
			reward: "Exclusive Brew NFT",
			rewardType: "badge",
			progress: 100,
			completed: true,
			type: "visit",
		},
	]);

	const [showRewardModal, setShowRewardModal] = useState(false);
	const [currentReward, setCurrentReward] = useState<Task | null>(null);

	const handleEmailUpload = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".eml";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const content = e.target?.result as string;
					setEmailFile(content);
					void startProving(content);
				};
				reader.readAsText(file);
			}
		};
		input.click();
	};

	const completeTask = (taskId: string) => {
		const task = tasks.find((t) => t.id === taskId);

		if (task?.type === "verify") {
			setShowEmailModal(true);
			return;
		}

		setTasks(
			tasks.map((task) => {
				if (task.id === taskId) {
					const completedTask = { ...task, progress: 100, completed: true };
					setCurrentReward(completedTask);
					setShowRewardModal(true);
					return completedTask;
				}
				return task;
			}),
		);
	};

	const handleCheckIn = () => {
		router.push(`/events/${eventSlug}/scan`);
	};

	const activeTasks = tasks.filter((task) => !task.completed);
	const completedTasks = tasks.filter((task) => task.completed);

	// Monitor email verification status
	useEffect(() => {
		if (onChainVerificationStatus === "success") {
			setTasks((prevTasks) =>
				prevTasks.map((task) => {
					if (task.id === "task-0" && task.type === "verify") {
						const completedTask = { ...task, progress: 100, completed: true };
						setCurrentReward(completedTask);
						setShowRewardModal(true);
						setShowEmailModal(false);
						return completedTask;
					}
					return task;
				}),
			);
		}
	}, [onChainVerificationStatus]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Tasks</h1>
					<p className="text-muted-foreground">
						Complete tasks to earn rewards at the event
					</p>
				</div>
				<Button onClick={handleCheckIn} size="sm">
					<QrCode className="mr-2 h-4 w-4" />
					Quick Scan
				</Button>
			</div>

			<div className="flex items-center justify-between rounded-xl bg-muted/30 p-5">
				<div>
					<h2 className="font-medium">Your Progress</h2>
					<p className="text-muted-foreground text-sm">
						{completedTasks.length} of {tasks.length} tasks completed
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Progress
						value={(completedTasks.length / tasks.length) * 100}
						className="w-32 md:w-48"
					/>
					<span className="font-medium text-sm">
						{Math.round((completedTasks.length / tasks.length) * 100)}%
					</span>
				</div>
			</div>

			<Tabs defaultValue="active" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="active">
						Active Tasks ({activeTasks.length})
					</TabsTrigger>
					<TabsTrigger value="completed">
						Completed ({completedTasks.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="active" className="mt-4 space-y-4">
					{activeTasks.length === 0 ? (
						<div className="py-8 text-center">
							<Trophy className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
							<h3 className="font-medium text-lg">All Tasks Completed!</h3>
							<p className="text-muted-foreground">
								Great job! You've completed all available tasks.
							</p>
						</div>
					) : (
						activeTasks.map((task) => (
							<Card key={task.id}>
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<CardTitle className="text-lg">{task.title}</CardTitle>
										<Badge
											variant={
												task.type === "visit"
													? "default"
													: task.type === "scan"
														? "secondary"
														: task.type === "verify"
															? "outline"
															: "outline"
											}
										>
											{task.type === "visit"
												? "Visit"
												: task.type === "scan"
													? "Scan QR"
													: task.type === "verify"
														? "Verify"
														: "Interact"}
										</Badge>
									</div>
									<CardDescription>{task.description}</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="mb-3 flex items-center text-muted-foreground text-sm">
										<MapPin className="mr-1 h-4 w-4" />
										{task.location}
									</div>

									{task.progress > 0 && task.progress < 100 && (
										<div className="space-y-1">
											<div className="flex justify-between text-xs">
												<span>Progress</span>
												<span>{task.progress}%</span>
											</div>
											<Progress value={task.progress} />
										</div>
									)}
								</CardContent>
								<CardFooter className="flex justify-between pt-2">
									<div className="flex items-center text-sm">
										<Trophy className="mr-1 h-4 w-4 text-amber-500" />
										<span>Reward: {task.reward}</span>
									</div>

									{task.type === "scan" ? (
										<Button size="sm" onClick={() => completeTask(task.id)}>
											<QrCode className="mr-2 h-4 w-4" />
											Scan QR
										</Button>
									) : task.type === "verify" ? (
										<Button size="sm" onClick={() => completeTask(task.id)}>
											<Mail className="mr-2 h-4 w-4" />
											Verify Email
										</Button>
									) : (
										<Button size="sm" onClick={() => completeTask(task.id)}>
											Complete
										</Button>
									)}
								</CardFooter>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent value="completed" className="mt-4 space-y-4">
					{completedTasks.length === 0 ? (
						<div className="py-8 text-center">
							<CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
							<h3 className="font-medium text-lg">No Completed Tasks Yet</h3>
							<p className="text-muted-foreground">
								Complete tasks to see them here
							</p>
						</div>
					) : (
						completedTasks.map((task) => (
							<Card key={task.id} className="bg-muted/30">
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<CheckCircle2 className="h-5 w-5 text-green-500" />
											<CardTitle className="text-lg">{task.title}</CardTitle>
										</div>
										<Badge variant="outline">Completed</Badge>
									</div>
									<CardDescription>{task.description}</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="flex items-center text-muted-foreground text-sm">
										<Trophy className="mr-1 h-4 w-4 text-amber-500" />
										<span>Earned: {task.reward}</span>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>

			{showRewardModal && currentReward && (
				<RewardModal
					reward={currentReward}
					open={showRewardModal}
					onClose={() => setShowRewardModal(false)}
				/>
			)}

			<Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Verify Ticket Ownership</DialogTitle>
						<DialogDescription>
							Upload your ticket confirmation email to prove ownership using
							zero-knowledge proof
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="flex flex-col items-center justify-center space-y-4 py-6">
							<Mail className="h-12 w-12 text-muted-foreground" />
							<p className="text-center text-muted-foreground text-sm">
								Upload the .eml file of your ticket confirmation email
							</p>
							<Button onClick={handleEmailUpload} variant="outline">
								<Mail className="mr-2 h-4 w-4" />
								Upload Email File
							</Button>
						</div>

						{verificationError && (
							<div className="rounded-lg bg-red-50 p-3">
								<p className="text-red-600 text-sm">
									{verificationError.toString()}
								</p>
							</div>
						)}

						{emailFile && !verificationError && (
							<div className="rounded-lg bg-blue-50 p-3">
								<p className="text-blue-600 text-sm">
									Generating zero-knowledge proof... This may take a moment.
								</p>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
