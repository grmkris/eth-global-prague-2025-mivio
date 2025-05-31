"use client";

import {
	Award,
	Calendar,
	MapPin,
	Star,
	Target,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import { BottomNavigation } from "~/components/bottom-navigation";
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
import { WalletGuard } from "~/components/wallet-guard";

export default function AchievementsPage() {
	const achievements = [
		{
			id: 1,
			name: "Early Bird",
			description: "Check in within the first hour",
			image: "/ach4.png",
			unlocked: true,
			points: 100,
			unlockedAt: "2025-01-10",
		},
		{
			id: 2,
			name: "Social Butterfly",
			description: "Connect with 10 other attendees",
			image: "/ach2.png",
			unlocked: true,
			points: 250,
			unlockedAt: "2025-01-12",
		},
		{
			id: 3,
			name: "Explorer",
			description: "Visit all event locations",
			image: "/ach1.png",
			unlocked: true,
			points: 500,
			unlockedAt: "2025-01-15",
		},
		{
			id: 4,
			name: "Super Fan",
			description: "Attend 5 events in a row",
			image: "/ach6.png",
			unlocked: false,
			points: 1000,
			progress: 3,
			total: 5,
		},
		{
			id: 5,
			name: "Master Collector",
			description: "Collect 50 unique rewards",
			image: "/ach5.png",
			unlocked: false,
			points: 2000,
			progress: 24,
			total: 50,
		},
	];

	const leaderboard = [
		{ rank: 1, name: "0x1234...5678", points: 15420, change: 0 },
		{ rank: 2, name: "0xabcd...efgh", points: 14200, change: 1 },
		{ rank: 3, name: "0x9876...5432", points: 13500, change: -1 },
		{ rank: 4, name: "You", points: 12450, change: 2, isUser: true },
		{ rank: 5, name: "0xijkl...mnop", points: 11200, change: -1 },
	];

	return (
		<WalletGuard>
			<div className="min-h-screen pb-20">
				<div className="p-6">
					<h1 className="mb-6 font-bold text-2xl">Achievements</h1>

					{/* Stats Overview */}
					<div className="mb-6 grid grid-cols-3 gap-4">
						<Card>
							<CardContent className="p-4 text-center">
								<Zap className="mx-auto mb-2 h-6 w-6 text-primary" />
								<p className="font-bold text-2xl">2,450</p>
								<p className="text-muted-foreground text-xs">Total Points</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<Trophy className="mx-auto mb-2 h-6 w-6 text-primary" />
								<p className="font-bold text-2xl">24</p>
								<p className="text-muted-foreground text-xs">Unlocked</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<Target className="mx-auto mb-2 h-6 w-6 text-primary" />
								<p className="font-bold text-2xl">#156</p>
								<p className="text-muted-foreground text-xs">Ranking</p>
							</CardContent>
						</Card>
					</div>

					<Tabs defaultValue="achievements" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="achievements">Achievements</TabsTrigger>
							<TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
						</TabsList>

						<TabsContent value="achievements" className="mt-4 space-y-4">
							{achievements.map((achievement) => (
								<Card
									key={achievement.id}
									className={achievement.unlocked ? "" : "opacity-60"}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-4">
											<div
												className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ${
													achievement.unlocked ? "" : "grayscale"
												}`}
											>
												<img
													src={achievement.image}
													alt={achievement.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														const img = e.currentTarget;
														img.style.display = "none";
														const parent = img.parentElement;
														if (parent) {
															parent.innerHTML =
																'<div class="text-2xl">🏆</div>';
														}
													}}
												/>
											</div>
											<div className="flex-1">
												<div className="flex items-start justify-between">
													<div>
														<h3 className="font-semibold">
															{achievement.name}
														</h3>
														<p className="text-muted-foreground text-sm">
															{achievement.description}
														</p>
													</div>
													<Badge
														variant={
															achievement.unlocked ? "default" : "secondary"
														}
													>
														+{achievement.points}
													</Badge>
												</div>
												{achievement.unlocked && achievement.unlockedAt && (
													<p className="mt-2 text-muted-foreground text-xs">
														Unlocked on{" "}
														{new Date(
															achievement.unlockedAt,
														).toLocaleDateString()}
													</p>
												)}
												{!achievement.unlocked &&
													achievement.progress !== undefined && (
														<div className="mt-3">
															<div className="mb-1 flex justify-between text-xs">
																<span>Progress</span>
																<span>
																	{achievement.progress}/{achievement.total}
																</span>
															</div>
															<Progress
																value={
																	(achievement.progress / achievement.total) *
																	100
																}
																className="h-2"
															/>
														</div>
													)}
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</TabsContent>

						<TabsContent value="leaderboard" className="mt-4">
							<Card>
								<CardHeader>
									<CardTitle className="text-base">Top Performers</CardTitle>
									<CardDescription>Weekly leaderboard</CardDescription>
								</CardHeader>
								<CardContent className="space-y-3">
									{leaderboard.map((entry) => (
										<div
											key={entry.rank}
											className={`flex items-center justify-between rounded-lg px-3 py-3 ${
												entry.isUser ? "bg-primary/10" : ""
											}`}
										>
											<div className="flex items-center gap-3">
												<span className="w-8 font-bold text-lg">
													#{entry.rank}
												</span>
												<div>
													<p className="font-medium">{entry.name}</p>
													<p className="text-muted-foreground text-sm">
														{entry.points.toLocaleString()} points
													</p>
												</div>
											</div>
											{entry.change !== 0 && (
												<span
													className={`text-sm ${
														entry.change > 0 ? "text-green-600" : "text-red-600"
													}`}
												>
													{entry.change > 0 ? "↑" : "↓"}{" "}
													{Math.abs(entry.change)}
												</span>
											)}
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
			<BottomNavigation />
		</WalletGuard>
	);
}
