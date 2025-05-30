"use client";

import {
	Calendar,
	CheckSquare,
	MapPin,
	ShoppingBag,
	Trophy,
	User,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEvent } from "~/components/event-provider";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function EventDashboard() {
	const { event, loading, error } = useEvent();
	const router = useRouter();

	if (loading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
					<Skeleton className="h-32" />
				</div>
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">Error loading event</p>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const navigationCards = [
		{
			title: "Tasks",
			description: "Complete tasks to earn rewards",
			icon: CheckSquare,
			href: `/event/${event.slug}/tasks`,
			color: "text-blue-500",
			stats: "5 available",
		},
		{
			title: "Shop",
			description: "Spend your EventCoins",
			icon: ShoppingBag,
			href: `/event/${event.slug}/shop`,
			color: "text-green-500",
			stats: "New items!",
		},
		{
			title: "Wallet",
			description: "Manage your funds",
			icon: Wallet,
			href: `/event/${event.slug}/wallet`,
			color: "text-purple-500",
			stats: "1,250 EC",
		},
		{
			title: "Profile",
			description: "View achievements",
			icon: User,
			href: `/event/${event.slug}/profile`,
			color: "text-orange-500",
			stats: "Level 3",
		},
	];

	return (
		<div className="space-y-6">
			{/* Event Header */}
			<div className="relative overflow-hidden rounded-lg bg-muted">
				<div className="aspect-[4/1] w-full">
					<img
						src={event.bannerImage}
						alt={event.name}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
				<div className="absolute right-0 bottom-0 left-0 p-6">
					<h1 className="mb-2 font-bold text-3xl text-white tracking-tight">
						{event.name}
					</h1>
					<p className="max-w-2xl text-white/80">{event.description}</p>
				</div>
			</div>

			{/* Event Info */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="font-medium text-base">
							Event Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="font-medium">Date</p>
								<p className="text-muted-foreground">
									{formatDate(event.startDate)} - {formatDate(event.endDate)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="font-medium">Location</p>
								<p className="text-muted-foreground">{event.location}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="font-medium text-base">
							Your Progress
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Trophy className="h-4 w-4 text-amber-500" />
								<span className="font-medium text-sm">Event Level</span>
							</div>
							<span className="font-bold text-sm">Level 3</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Wallet className="h-4 w-4 text-purple-500" />
								<span className="font-medium text-sm">Balance</span>
							</div>
							<span className="font-bold text-sm">1,250 EC</span>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckSquare className="h-4 w-4 text-green-500" />
								<span className="font-medium text-sm">Tasks</span>
							</div>
							<span className="font-bold text-sm">3/10 completed</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Navigation Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{navigationCards.map((card) => (
					<Card
						key={card.title}
						className="cursor-pointer transition-shadow hover:shadow-lg"
						onClick={() => router.push(card.href)}
					>
						<CardHeader>
							<div className="flex items-center justify-between">
								<card.icon className={`h-8 w-8 ${card.color}`} />
								<span className="text-muted-foreground text-xs">
									{card.stats}
								</span>
							</div>
							<CardTitle className="text-lg">{card.title}</CardTitle>
							<CardDescription>{card.description}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</div>
		</div>
	);
}
