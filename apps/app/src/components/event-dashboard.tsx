"use client";

import {
	Calendar,
	CheckSquare,
	MapPin,
	ShoppingBag,
	Trophy,
	Wallet,
} from "lucide-react";
import { useEvent } from "~/components/event-provider";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";

export function EventDashboard() {
	const { event, loading, error } = useEvent();

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

	return (
		<div className="space-y-4">
			{/* Event Header */}
			<div className="relative overflow-hidden rounded-2xl bg-muted">
				<div className="aspect-[5/1] w-full">
					<img
						src={event.bannerImage}
						alt={event.name}
						className="h-full w-full object-cover opacity-90"
					/>
				</div>
				<div className="absolute inset-0 bg-black/20" />
				<div className="absolute right-0 bottom-0 left-0 p-4">
					<h1 className="mb-1 font-bold text-2xl text-white tracking-tight">
						{event.name}
					</h1>
					<p className="line-clamp-1 max-w-2xl text-sm text-white/90">
						{event.description}
					</p>
				</div>
			</div>

			{/* Event Info */}
			<div className="grid gap-4 md:grid-cols-1">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-sm">Event Details</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center gap-2 text-sm">
							<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
							<div>
								<p className="font-medium text-xs">Date</p>
								<p className="text-muted-foreground text-xs">
									{formatDate(event.startDate)} - {formatDate(event.endDate)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2 text-sm">
							<MapPin className="h-3.5 w-3.5 text-muted-foreground" />
							<div>
								<p className="font-medium text-xs">Location</p>
								<p className="text-muted-foreground text-xs">
									{event.location}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity & Progress */}
			<div className="grid gap-4 lg:grid-cols-2">
				{/* Recent Payments */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<Wallet className="h-5 w-5 text-primary" />
							Recent Activity
						</CardTitle>
						<CardDescription className="text-xs">
							Your latest transactions
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between border-b py-1.5 last:border-0">
							<div className="flex items-center gap-2">
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/20">
									<CheckSquare className="h-3.5 w-3.5 text-secondary-foreground" />
								</div>
								<div>
									<p className="font-medium text-sm">Task Completed</p>
									<p className="text-muted-foreground text-xs">
										Main Stage Visit
									</p>
								</div>
							</div>
							<span className="font-medium text-secondary-foreground text-sm">
								+50 USDC
							</span>
						</div>
						<div className="flex items-center justify-between border-b py-1.5 last:border-0">
							<div className="flex items-center gap-2">
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10">
									<ShoppingBag className="h-3.5 w-3.5 text-destructive" />
								</div>
								<div>
									<p className="font-medium text-sm">Purchase</p>
									<p className="text-muted-foreground text-xs">
										Coffee & Pastry
									</p>
								</div>
							</div>
							<span className="font-medium text-destructive text-sm">
								-120 USDC
							</span>
						</div>
						<div className="flex items-center justify-between border-b py-1.5 last:border-0">
							<div className="flex items-center gap-2">
								<div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
									<MapPin className="h-3.5 w-3.5 text-primary" />
								</div>
								<div>
									<p className="font-medium text-sm">Check-in</p>
									<p className="text-muted-foreground text-xs">
										Partner Booth #42
									</p>
								</div>
							</div>
							<span className="font-medium text-primary text-sm">+25 USDC</span>
						</div>
					</CardContent>
				</Card>

				{/* Progress Summary */}
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<Trophy className="h-5 w-5 text-primary" />
							Your Progress
						</CardTitle>
						<CardDescription className="text-xs">
							Keep up the great work!
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<div>
							<div className="mb-1 flex justify-between text-sm">
								<span>Daily Tasks</span>
								<span className="font-medium">3/5 completed</span>
							</div>
							<Progress value={60} className="h-2" />
						</div>
						<div>
							<div className="mb-1 flex justify-between text-sm">
								<span>Event Level Progress</span>
								<span className="font-medium">Level 3 (65%)</span>
							</div>
							<Progress value={65} className="h-2" />
						</div>
						<div>
							<div className="mb-1 flex justify-between text-sm">
								<span>Venue Exploration</span>
								<span className="font-medium">7/10 areas</span>
							</div>
							<Progress value={70} className="h-2" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
