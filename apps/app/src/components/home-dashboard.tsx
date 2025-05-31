"use client";

import { Bell, Calendar, Download, MapPin, Plus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

type Event = {
	id: string;
	slug: string;
	name: string;
	location: string;
	startDate: string;
	endDate: string;
	bannerImage: string;
	status: "upcoming" | "active" | "completed";
	isOnline?: boolean;
};

type RecentBadge = {
	id: string;
	name: string;
	image: string;
};

export function HomeDashboard() {
	const router = useRouter();
	const { address } = useAccount();

	// Randomly select an NFT avatar
	const randomAvatar = useMemo(() => {
		const avatars = ["/nft-1.png", "/nft-2.png", "/nft-3.png"];
		return avatars[Math.floor(Math.random() * avatars.length)];
	}, []);

	// Mock data
	const events: Event[] = [
		{
			id: "1",
			slug: "synthwave-fest",
			name: "Synthwave Fest",
			location: "Berlin",
			startDate: "2025-06-08",
			endDate: "2025-06-10",
			bannerImage: "/synthwave_festival.png",
			status: "upcoming",
		},
		{
			id: "2",
			slug: "coffee-carnival",
			name: "Coffee Carnival",
			location: "Online",
			startDate: "2025-07-15",
			endDate: "2025-07-15",
			bannerImage: "/coffee_festival.png",
			status: "upcoming",
			isOnline: true,
		},
		{
			id: "3",
			slug: "digital-art-exhibition",
			name: "Digital Art Exhibition",
			location: "San Francisco",
			startDate: "2025-10-05",
			endDate: "2025-10-20",
			bannerImage: "/digital_art_exhibition.png",
			status: "upcoming",
		},
	];

	const userStats = {
		xp: 1340,
		xpMax: 2000,
		currentStreak: 4,
		currentQuest: "General Event Engagement",
		questProgress: 1,
		questTotal: 5,
		balance: 160.0,
		currency: "USDC",
	};

	const recentBadges: RecentBadge[] = [
		{ id: "1", name: "Explorer", image: "/ach1.png" },
		{ id: "2", name: "Social Butterfly", image: "/ach2.png" },
		{ id: "3", name: "Night Owl", image: "/ach3.png" },
		{ id: "4", name: "Early Bird", image: "/ach4.png" },
		{ id: "5", name: "Backpack Pro", image: "/ach5.png" },
		{ id: "6", name: "Market Master", image: "/ach6.png" },
	];

	const formatEventDate = (startDate: string, endDate: string) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const startMonth = start.toLocaleDateString("en-US", { month: "short" });
		const startDay = start.getDate();
		const endDay = end.getDate();

		if (startDate === endDate) {
			return `${startMonth} ${startDay}`;
		}
		return `${startMonth} ${startDay}-${endDay}`;
	};

	const handleEventClick = (eventSlug: string) => {
		router.push(`/events/${eventSlug}`);
	};

	const getGreeting = () => {
		const userName = address ? "User" : "Anna"; // In real app, fetch user name
		return `Hello, ${userName}!`;
	};

	return (
		<div className="flex h-screen flex-col bg-background">
			{/* Header */}
			<div className="flex items-center justify-between p-3 pb-1">
				<div className="flex items-center gap-2">
					<Avatar className="h-10 w-10">
						<AvatarImage src={randomAvatar} />
						<AvatarFallback>
							{address ? address.slice(0, 2).toUpperCase() : "AN"}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="font-semibold text-base">{getGreeting()}</h1>
						<p className="text-muted-foreground text-xs">Your Festival Hub</p>
					</div>
				</div>
				<Button size="icon" variant="ghost" className="relative h-9 w-9">
					<Bell className="h-4 w-4" />
					<span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
				</Button>
			</div>

			{/* Main Content - Scrollable if needed but designed to fit */}
			<div className="flex-1 overflow-y-auto px-3 pb-16">
				{/* Upcoming Events */}
				<div className="mt-3">
					<h2 className="mb-2 font-semibold text-sm">Upcoming Events</h2>
					<div className="scrollbar-hide -mx-3 flex gap-2 overflow-x-auto px-3">
						{events.map((event) => (
							<Card
								key={event.id}
								className="w-56 flex-shrink-0 cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
								onClick={() => handleEventClick(event.slug)}
							>
								<div className="relative h-32 overflow-hidden bg-muted">
									<img
										src={event.bannerImage}
										alt={event.name}
										className="absolute inset-0 h-full w-full object-cover"
									/>
								</div>
								<CardContent className="p-3">
									<h3 className="mb-0.5 font-semibold text-sm">{event.name}</h3>
									<p className="mb-2 text-muted-foreground text-xs">
										{formatEventDate(event.startDate, event.endDate)},{" "}
										{event.location}
									</p>
									<Button
										className="h-8 w-full text-xs"
										variant={event.id === "1" ? "default" : "secondary"}
										onClick={(e) => {
											e.stopPropagation();
											handleEventClick(event.slug);
										}}
									>
										{event.id === "1" ? "Enter" : "Join"}
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* XP Progress */}
				<div className="mt-4 rounded-lg bg-muted/30 p-3">
					<div className="mb-1.5 flex items-center justify-between">
						<span className="font-semibold text-xs">
							XP: {userStats.xp.toLocaleString()}
						</span>
						<span className="flex items-center gap-1 font-medium text-orange-500 text-xs">
							🔥 {userStats.currentStreak} day streak
						</span>
					</div>
					<Progress
						value={(userStats.xp / userStats.xpMax) * 100}
						className="h-2"
					/>
					<p className="mt-1.5 text-muted-foreground text-xs">
						Current Quest: {userStats.currentQuest} ({userStats.questProgress}/
						{userStats.questTotal})
					</p>
				</div>

				{/* Recent Badges */}
				<div className="mt-4">
					<div className="mb-2 flex items-center justify-between">
						<h2 className="font-semibold text-sm">Recent Badges</h2>
						<Button
							variant="link"
							size="sm"
							className="h-auto p-0 text-primary text-xs"
							onClick={() => router.push("/achievements")}
						>
							View All
						</Button>
					</div>
					<div className="scrollbar-hide -mx-3 flex gap-3 overflow-x-auto px-3 pb-1">
						{recentBadges.map((badge) => (
							<div
								key={badge.id}
								className="flex flex-shrink-0 flex-col items-center gap-0.5"
							>
								<div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-muted">
									<img
										src={badge.image}
										alt={badge.name}
										className="absolute inset-0 h-full w-full object-cover"
										onError={(e) => {
											const img = e.currentTarget;
											img.style.display = "none";
											const parent = img.parentElement;
											if (parent) {
												parent.innerHTML = '<div class="text-lg">🏆</div>';
											}
										}}
									/>
								</div>
								<span className="max-w-[56px] text-center text-muted-foreground text-xs">
									{badge.name}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Balance */}
				<div className="mt-4 mb-2">
					<Card className="bg-gradient-to-br from-primary/10 to-background">
						<CardContent className="p-3">
							<p className="mb-0.5 text-muted-foreground text-xs">Balance</p>
							<div className="mb-2 flex items-center justify-between">
								<p className="font-bold text-xl">
									{userStats.currency} ${userStats.balance.toFixed(2)}
								</p>
								<Button
									size="icon"
									variant="secondary"
									className="h-8 w-8 rounded-full"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<Button variant="default" size="sm" className="h-8 text-xs">
									<Send className="mr-1.5 h-3 w-3" />
									Send
								</Button>
								<Button variant="secondary" size="sm" className="h-8 text-xs">
									<Download className="mr-1.5 h-3 w-3" />
									Receive
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
