"use client";

import type React from "react";

import { Award, CheckCircle2, Medal, Star, Trophy, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type Achievement = {
	id: string;
	title: string;
	description: string;
	icon: React.ElementType;
	earned: boolean;
	progress?: number;
};

type Reward = {
	id: string;
	title: string;
	type: "badge" | "token" | "perk";
	description: string;
	date: string;
};

export function ProfileDashboard() {
	const achievements: Achievement[] = [
		{
			id: "ach-1",
			title: "Early Bird",
			description: "Arrived at the event within the first hour",
			icon: Medal,
			earned: true,
		},
		{
			id: "ach-2",
			title: "Networking Pro",
			description: "Connected with 10+ attendees",
			icon: Star,
			earned: false,
			progress: 40,
		},
		{
			id: "ach-3",
			title: "Task Master",
			description: "Completed all available tasks",
			icon: CheckCircle2,
			earned: false,
			progress: 60,
		},
		{
			id: "ach-4",
			title: "VIP Status",
			description: "Earned over 1,000 EventCoins",
			icon: Trophy,
			earned: true,
		},
	];

	const rewards: Reward[] = [
		{
			id: "reward-1",
			title: "Early Access Badge",
			type: "badge",
			description: "Exclusive access to new product demos",
			date: "Today, 2:30 PM",
		},
		{
			id: "reward-2",
			title: "50 EventCoins",
			type: "token",
			description: "Reward for completing 'Visit Main Stage' task",
			date: "Today, 2:30 PM",
		},
		{
			id: "reward-3",
			title: "Free Drink Voucher",
			type: "perk",
			description: "Redeemable at any event bar",
			date: "Today, 11:45 AM",
		},
		{
			id: "reward-4",
			title: "Exclusive NFT",
			type: "badge",
			description: "Limited edition event collectible",
			date: "Yesterday, 4:20 PM",
		},
	];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Profile</h1>
				<p className="text-muted-foreground">
					View your achievements and rewards
				</p>
			</div>

			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center gap-4">
						<Avatar className="h-16 w-16">
							<AvatarImage
								src="/placeholder.svg?height=64&width=64"
								alt="User"
							/>
							<AvatarFallback>
								<User className="h-8 w-8" />
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle className="text-xl">Alex Johnson</CardTitle>
							<CardDescription>Event Attendee</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Trophy className="h-5 w-5 text-amber-500" />
								<span className="font-medium">EventCoins Balance:</span>
							</div>
							<span className="font-bold">1,250 USDC</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Award className="h-5 w-5 text-blue-500" />
								<span className="font-medium">Badges Earned:</span>
							</div>
							<span className="font-bold">3</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-5 w-5 text-green-500" />
								<span className="font-medium">Tasks Completed:</span>
							</div>
							<span className="font-bold">5/10</span>
						</div>

						<div className="space-y-1">
							<div className="flex justify-between text-sm">
								<span>Event Level</span>
								<span>Level 3</span>
							</div>
							<Progress value={65} />
							<div className="flex justify-between text-muted-foreground text-xs">
								<span>650/1000 XP</span>
								<span>Next: Level 4</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue="achievements" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="achievements">Achievements</TabsTrigger>
					<TabsTrigger value="rewards">Rewards</TabsTrigger>
				</TabsList>

				<TabsContent value="achievements" className="mt-4 space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						{achievements.map((achievement) => (
							<Card
								key={achievement.id}
								className={achievement.earned ? "border-primary/50" : ""}
							>
								<CardHeader className="pb-2">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<div
												className={`rounded-full p-2 ${
													achievement.earned
														? "bg-primary/10 text-primary"
														: "bg-muted text-muted-foreground"
												}`}
											>
												<achievement.icon className="h-5 w-5" />
											</div>
											<CardTitle className="text-base">
												{achievement.title}
											</CardTitle>
										</div>
										{achievement.earned && (
											<Badge
												variant="outline"
												className="border-primary text-primary"
											>
												Earned
											</Badge>
										)}
									</div>
									<CardDescription>{achievement.description}</CardDescription>
								</CardHeader>
								{!achievement.earned && achievement.progress !== undefined && (
									<CardContent className="pt-0">
										<div className="space-y-1">
											<div className="flex justify-between text-xs">
												<span>Progress</span>
												<span>{achievement.progress}%</span>
											</div>
											<Progress value={achievement.progress} />
										</div>
									</CardContent>
								)}
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="rewards" className="mt-4 space-y-4">
					<div className="space-y-3">
						{rewards.map((reward) => (
							<Card key={reward.id}>
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<div
												className={`rounded-full p-2 ${
													reward.type === "badge"
														? "bg-blue-100 text-blue-600"
														: reward.type === "token"
															? "bg-amber-100 text-amber-600"
															: "bg-green-100 text-green-600"
												}`}
											>
												{reward.type === "badge" ? (
													<Award className="h-4 w-4" />
												) : reward.type === "token" ? (
													<Trophy className="h-4 w-4" />
												) : (
													<Star className="h-4 w-4" />
												)}
											</div>
											<div>
												<CardTitle className="text-base">
													{reward.title}
												</CardTitle>
												<CardDescription className="text-xs">
													{reward.date}
												</CardDescription>
											</div>
										</div>
										<Badge
											variant={
												reward.type === "badge"
													? "secondary"
													: reward.type === "token"
														? "default"
														: "outline"
											}
										>
											{reward.type === "badge"
												? "Badge"
												: reward.type === "token"
													? "Token"
													: "Perk"}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="pt-0">
									<p className="text-sm">{reward.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
