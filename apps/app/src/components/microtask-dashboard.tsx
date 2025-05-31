"use client";

import { CheckCircle2, MapPin, QrCode, Trophy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type Task = {
	id: string;
	title: string;
	description: string;
	location: string;
	reward: string;
	rewardType: "token" | "badge" | "perk";
	progress: number;
	completed: boolean;
	type: "visit" | "scan" | "interact";
};

export function MicrotaskDashboard() {
	const router = useRouter();
	const params = useParams();
	const eventSlug = params.eventSlug as string;

	const [tasks, setTasks] = useState<Task[]>([
		{
			id: "task-1",
			title: "Visit Main Stage",
			description: "Check out the keynote presentation at the main stage",
			location: "Main Stage - Hall A",
			reward: "50 EventCoins",
			rewardType: "token",
			progress: 0,
			completed: false,
			type: "visit",
		},
		{
			id: "task-2",
			title: "Scan QR at Partner Booth",
			description: "Visit our partner's booth and scan their QR code",
			location: "Booth #42 - Exhibition Hall",
			reward: "Early Access Badge",
			rewardType: "badge",
			progress: 0,
			completed: false,
			type: "scan",
		},
		{
			id: "task-3",
			title: "Attend Workshop",
			description: "Join the interactive workshop on Web3 basics",
			location: "Workshop Room C",
			reward: "Free Drink Voucher",
			rewardType: "perk",
			progress: 0,
			completed: false,
			type: "interact",
		},
		{
			id: "task-4",
			title: "Network with Speakers",
			description: "Connect with at least 3 speakers at the networking area",
			location: "Networking Lounge",
			reward: "100 EventCoins",
			rewardType: "token",
			progress: 33,
			completed: false,
			type: "interact",
		},
		{
			id: "task-5",
			title: "Product Demo",
			description: "Watch the live product demonstration",
			location: "Demo Area - Hall B",
			reward: "Exclusive NFT",
			rewardType: "badge",
			progress: 100,
			completed: true,
			type: "visit",
		},
	]);

	const [showRewardModal, setShowRewardModal] = useState(false);
	const [currentReward, setCurrentReward] = useState<Task | null>(null);

	const completeTask = (taskId: string) => {
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

	const handleQuickScan = () => {
		router.push(`/event/${eventSlug}/scan`);
	};

	const activeTasks = tasks.filter((task) => !task.completed);
	const completedTasks = tasks.filter((task) => task.completed);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Tasks</h1>
					<p className="text-muted-foreground">
						Complete tasks to earn rewards at the event
					</p>
				</div>
				<Button onClick={handleQuickScan} size="sm">
					<QrCode className="mr-2 h-4 w-4" />
					Quick Scan
				</Button>
			</div>

			<div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
				<div>
					<h2 className="font-medium">Your Progress</h2>
					<p className="text-muted-foreground text-sm">
						{completedTasks.length} of {tasks.length} tasks completed
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Progress
						value={(completedTasks.length / tasks.length) * 100}
						className="w-24 md:w-40"
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
														: "outline"
											}
										>
											{task.type === "visit"
												? "Visit"
												: task.type === "scan"
													? "Scan QR"
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
		</div>
	);
}
