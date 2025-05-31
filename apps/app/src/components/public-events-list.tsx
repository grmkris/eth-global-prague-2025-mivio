"use client";

import { ArrowRight, Calendar, Lock, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
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

type Event = {
	id: string;
	slug: string;
	name: string;
	description: string;
	location: string;
	startDate: string;
	endDate: string;
	bannerImage: string;
	attendees: number;
	status: "upcoming" | "active" | "completed";
};


export function PublicEventsList() {
	const router = useRouter();
	const { isConnected } = useAccount();

	// Mock data - in real app, this would come from an API
	const [events] = useState<Event[]>([
		{
			id: "1",
			slug: "eth-global-prague-2025",
			name: "ETHGlobal Prague 2025",
			description:
				"Join the largest Ethereum hackathon in Central Europe. Build the future of Web3 with developers from around the world.",
			location: "Prague Congress Centre, Czech Republic",
			startDate: "2025-02-14",
			endDate: "2025-02-16",
			bannerImage: "/placeholder.svg?height=200&width=400",
			attendees: 1500,
			status: "active",
		},
		{
			id: "2",
			slug: "web3-summit-berlin",
			name: "Web3 Summit Berlin",
			description:
				"The premier conference for decentralized web infrastructure and protocols.",
			location: "Berlin, Germany",
			startDate: "2025-03-20",
			endDate: "2025-03-22",
			bannerImage: "/placeholder.svg?height=200&width=400",
			attendees: 800,
			status: "upcoming",
		},
		{
			id: "3",
			slug: "defi-conf-london",
			name: "DeFi Conference London",
			description:
				"Explore the latest innovations in decentralized finance with industry leaders.",
			location: "London, UK",
			startDate: "2025-01-10",
			endDate: "2025-01-11",
			bannerImage: "/placeholder.svg?height=200&width=400",
			attendees: 600,
			status: "completed",
		},
	]);

	const handleEventSelect = (eventSlug: string) => {
		// Always go to public event page first
		router.push(`/events/${eventSlug}`);
	};

	const getStatusBadge = (status: Event["status"]) => {
		switch (status) {
			case "active":
				return <Badge className="bg-green-500">Live Now</Badge>;
			case "upcoming":
				return <Badge variant="secondary">Upcoming</Badge>;
			case "completed":
				return <Badge variant="outline">Completed</Badge>;
		}
	};

	const formatDateRange = (startDate: string, endDate: string) => {
		const start = new Date(startDate).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
		const end = new Date(endDate).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		return `${start} - ${end}`;
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
			<appkit-button />
			<div className="container mx-auto px-4 py-12">
				{/* Hero Section */}
				<div className="mb-12 space-y-4 text-center">
					<h1 className="font-bold text-4xl tracking-tight md:text-5xl">
						Discover Web3 Events
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Join hackathons, conferences, and workshops. Complete tasks, earn
						rewards, and connect with the Web3 community.
					</p>
					{!isConnected && (
						<div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm">
							<Lock className="h-4 w-4" />
							<span>Connect your wallet to participate in events</span>
						</div>
					)}
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{events.map((event) => (
						<Card
							key={event.id}
							className="hover:-translate-y-1 overflow-hidden transition-all duration-300 hover:shadow-xl"
						>
							<div className="relative aspect-video bg-muted">
								<img
									src={event.bannerImage}
									alt={event.name}
									className="h-full w-full object-cover"
								/>
								<div className="absolute top-2 right-2">
									{getStatusBadge(event.status)}
								</div>
							</div>

							<CardHeader>
								<CardTitle className="text-xl">{event.name}</CardTitle>
								<CardDescription className="line-clamp-2">
									{event.description}
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-2">
								<div className="flex items-center gap-2 text-muted-foreground text-sm">
									<Calendar className="h-4 w-4" />
									<span>{formatDateRange(event.startDate, event.endDate)}</span>
								</div>

								<div className="flex items-center gap-2 text-muted-foreground text-sm">
									<MapPin className="h-4 w-4" />
									<span className="line-clamp-1">{event.location}</span>
								</div>

								<div className="flex items-center gap-2 text-muted-foreground text-sm">
									<Users className="h-4 w-4" />
									<span>{event.attendees.toLocaleString()} attendees</span>
								</div>
							</CardContent>

							<CardFooter>
								<Button
									className="w-full"
									onClick={() => handleEventSelect(event.slug)}
									disabled={event.status === "completed" && !isConnected}
								>
									View Details
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
