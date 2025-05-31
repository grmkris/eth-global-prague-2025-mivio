"use client";

import { 
	Calendar, 
	MapPin, 
	Bell,
	Plus,
	Send,
	Download
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAccount } from "wagmi";

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
		balance: 160.00,
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
		<div className="flex flex-col h-screen bg-background">
			{/* Header */}
			<div className="flex items-center justify-between p-4 pb-2">
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12">
						<AvatarImage src="/placeholder-avatar.png" />
						<AvatarFallback>
							{address ? address.slice(0, 2).toUpperCase() : "AN"}
						</AvatarFallback>
					</Avatar>
					<div>
						<h1 className="font-semibold text-lg">{getGreeting()}</h1>
						<p className="text-sm text-muted-foreground">Your Festival Hub</p>
					</div>
				</div>
				<Button size="icon" variant="ghost" className="relative">
					<Bell className="h-5 w-5" />
					<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
				</Button>
			</div>

			{/* Main Content - Scrollable if needed but designed to fit */}
			<div className="flex-1 overflow-y-auto px-4 pb-20">
				{/* Upcoming Events */}
				<div className="mt-4">
					<h2 className="font-semibold text-base mb-3">Upcoming Events</h2>
					<div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
						{events.map((event) => (
							<Card 
								key={event.id}
								className="flex-shrink-0 w-64 cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
								onClick={() => handleEventClick(event.slug)}
							>
								<div className="relative h-40 bg-muted overflow-hidden">
									<img
										src={event.bannerImage}
										alt={event.name}
										className="h-full w-full object-cover"
									/>
								</div>
								<CardContent className="p-4">
									<h3 className="font-semibold text-base mb-1">{event.name}</h3>
									<p className="text-sm text-muted-foreground mb-3">
										{formatEventDate(event.startDate, event.endDate)}, {event.location}
									</p>
									<Button 
										className="w-full"
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
				<div className="mt-6 bg-muted/30 rounded-lg p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="font-semibold text-sm">XP: {userStats.xp.toLocaleString()}</span>
						<span className="text-xs text-orange-500 font-medium flex items-center gap-1">
							🔥 {userStats.currentStreak} day streak
						</span>
					</div>
					<Progress value={(userStats.xp / userStats.xpMax) * 100} className="h-2" />
					<p className="text-xs text-muted-foreground mt-2">
						Current Quest: {userStats.currentQuest} ({userStats.questProgress}/{userStats.questTotal})
					</p>
				</div>

				{/* Recent Badges */}
				<div className="mt-6">
					<div className="flex items-center justify-between mb-3">
						<h2 className="font-semibold text-base">Recent Badges</h2>
						<Button 
							variant="link" 
							size="sm" 
							className="text-primary h-auto p-0"
							onClick={() => router.push("/achievements")}
						>
							View All
						</Button>
					</div>
					<div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
						{recentBadges.map((badge) => (
							<div key={badge.id} className="flex flex-col items-center gap-1 flex-shrink-0">
								<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
									<img 
										src={badge.image} 
										alt={badge.name}
										className="h-full w-full object-cover"
										onError={(e) => {
											const img = e.currentTarget;
											img.style.display = 'none';
											const parent = img.parentElement;
											if (parent) {
												parent.innerHTML = '<div class="text-2xl">🏆</div>';
											}
										}}
									/>
								</div>
								<span className="text-xs text-muted-foreground text-center max-w-[64px]">{badge.name}</span>
							</div>
						))}
					</div>
				</div>

				{/* Balance */}
				<div className="mt-6 mb-4">
					<Card className="bg-gradient-to-br from-primary/10 to-background">
						<CardContent className="p-4">
							<p className="text-sm text-muted-foreground mb-1">Balance</p>
							<div className="flex items-center justify-between mb-3">
								<p className="text-2xl font-bold">
									{userStats.currency} ${userStats.balance.toFixed(2)}
								</p>
								<Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
									<Plus className="h-5 w-5" />
								</Button>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<Button variant="default" size="sm" className="h-10">
									<Send className="mr-2 h-4 w-4" />
									Send
								</Button>
								<Button variant="secondary" size="sm" className="h-10">
									<Download className="mr-2 h-4 w-4" />
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