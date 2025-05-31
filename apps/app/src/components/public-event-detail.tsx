"use client";

import {
	ArrowLeft,
	Calendar,
	CheckSquare,
	Lock,
	type LucideIcon,
	MapPin,
	ShoppingBag,
	Star,
	Trophy,
	Users,
	Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ConnectButton from "~/components/connect-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
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
	status: "upcoming" | "active" | "completed";
	features: string[];
	highlights: {
		title: string;
		value: string;
		icon: LucideIcon;
	}[];
};

export function PublicEventDetail({ eventSlug }: { eventSlug: string }) {
	const router = useRouter();
	const { isConnected } = useAccount();
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Mock API call
		const fetchEvent = async () => {
			setLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 500));

			const events: Event[] = [
				{
					id: "1",
					slug: "summer-music-fest-2025",
					name: "Summer Music Festival 2025",
					description:
						"The ultimate 3-day music experience featuring top artists across multiple genres. Dance, sing, and create memories with music lovers from around the world. Enjoy multiple stages, food trucks, and exclusive artist meet & greets.",
					location: "Central Park, New York",
					startDate: "2025-07-18",
					endDate: "2025-07-20",
					bannerImage: "/placeholder.svg?height=400&width=800",
					status: "active",
					features: [
						"Complete challenges to earn EventCoins",
						"Exchange coins for food, drinks, and exclusive merchandise",
						"Track your progress and unlock special achievements",
						"Connect with 25,000+ music fans and artists",
						"Access exclusive artist meet & greets and VIP areas",
					],
					highlights: [
						{ title: "Artists", value: "100+", icon: Trophy },
						{ title: "Attendees", value: "25,000+", icon: Users },
						{ title: "Food Vendors", value: "30+", icon: Star },
						{ title: "Stages", value: "5", icon: CheckSquare },
					],
				},
				{
					id: "2",
					slug: "indie-rock-weekend",
					name: "Indie Rock Weekend",
					description:
						"Discover emerging indie artists and enjoy craft food & drinks in an intimate outdoor setting. Experience the best of indie rock with curated performances and artisanal vendors.",
					location: "Golden Gate Park, San Francisco",
					startDate: "2025-08-15",
					endDate: "2025-08-17",
					bannerImage: "/placeholder.svg?height=400&width=800",
					status: "upcoming",
					features: [
						"Discover new artists on intimate stages",
						"Earn rewards for exploring different venues",
						"Access craft beer and artisanal food vendors",
						"Collect limited edition band merchandise",
						"Join acoustic sessions and songwriter circles",
					],
					highlights: [
						{ title: "Bands", value: "50+", icon: Users },
						{ title: "Craft Vendors", value: "20+", icon: MapPin },
						{ title: "Sessions", value: "15+", icon: CheckSquare },
						{ title: "Local Artists", value: "25+", icon: Star },
					],
				},
			];

			const foundEvent = events.find((e) => e.slug === eventSlug);
			if (foundEvent) {
				setEvent(foundEvent);
			}
			setLoading(false);
		};

		fetchEvent();
	}, [eventSlug]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="space-y-4 text-center">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
					<p className="text-muted-foreground">Loading event details...</p>
				</div>
			</div>
		);
	}

	if (!event) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="space-y-4 text-center">
					<h2 className="font-bold text-2xl">Event Not Found</h2>
					<p className="text-muted-foreground">
						The event you're looking for doesn't exist.
					</p>
					<Button onClick={() => router.push("/events")}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Events
					</Button>
				</div>
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

	const handleJoinEvent = () => {
		if (isConnected) {
			router.push(`/event/${event.slug}`);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
			{/* <CallVerifierContract /> */}
			{/* Header */}
			<div className="container mx-auto px-4 py-6">
				<Button
					variant="ghost"
					onClick={() => router.push("/events")}
					className="mb-4"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Events
				</Button>
			</div>

			{/* Hero Section */}
			<div className="relative">
				<div className="aspect-[3/1] max-h-[400px] w-full overflow-hidden">
					<img
						src={event.bannerImage}
						alt={event.name}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
				<div className="absolute right-0 bottom-0 left-0 p-6 md:p-12">
					<div className="container mx-auto">
						<div className="flex items-start justify-between">
							<div className="max-w-3xl">
								<div className="mb-4 flex items-center gap-2">
									{event.status === "active" && (
										<Badge className="bg-green-500">Live Now</Badge>
									)}
									{event.status === "upcoming" && (
										<Badge variant="secondary">Upcoming</Badge>
									)}
									{event.status === "completed" && (
										<Badge variant="outline">Completed</Badge>
									)}
								</div>
								<h1 className="mb-4 font-bold text-4xl text-white md:text-5xl">
									{event.name}
								</h1>
								<p className="mb-6 text-lg text-white/80">
									{event.description}
								</p>
								<div className="flex flex-wrap gap-4 text-white/80">
									<div className="flex items-center gap-2">
										<Calendar className="h-5 w-5" />
										<span>
											{formatDate(event.startDate)} -{" "}
											{formatDate(event.endDate)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5" />
										<span>{event.location}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="container mx-auto px-4 py-12">
				<div className="grid gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="space-y-8 lg:col-span-2">
						{/* Highlights */}
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							{event.highlights.map((highlight) => (
								<Card key={highlight.title}>
									<CardContent className="p-4 text-center">
										<highlight.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
										<p className="font-bold text-2xl">{highlight.value}</p>
										<p className="text-muted-foreground text-sm">
											{highlight.title}
										</p>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Features */}
						<Card>
							<CardHeader>
								<CardTitle>What You Can Do</CardTitle>
								<CardDescription>
									Join the event to unlock these features
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-3">
									{event.features.map((feature, index) => (
										<li key={feature} className="flex items-start gap-3">
											<CheckSquare className="mt-0.5 h-5 w-5 text-primary" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* Interactive Features Preview */}
						<div className="grid gap-4 md:grid-cols-2">
							<Card className="relative overflow-hidden">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Wallet className="h-5 w-5" />
										Event Wallet
									</CardTitle>
									<CardDescription>
										Manage your EventCoins and track transactions
									</CardDescription>
								</CardHeader>
								{!isConnected && (
									<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
										<Lock className="h-8 w-8 text-muted-foreground" />
									</div>
								)}
							</Card>

							<Card className="relative overflow-hidden">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<ShoppingBag className="h-5 w-5" />
										Event Shop
									</CardTitle>
									<CardDescription>
										Exchange coins for food, merch, and experiences
									</CardDescription>
								</CardHeader>
								{!isConnected && (
									<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
										<Lock className="h-8 w-8 text-muted-foreground" />
									</div>
								)}
							</Card>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Join Card */}
						<Card className="border-primary">
							<CardHeader>
								<CardTitle>Ready to Join?</CardTitle>
								<CardDescription>
									{isConnected
										? "Enter the event to start earning rewards"
										: "Connect your wallet to participate"}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{isConnected ? (
									<Button
										className="w-full"
										size="lg"
										onClick={handleJoinEvent}
										disabled={event.status === "completed"}
									>
										Enter Event
									</Button>
								) : (
									<div className="space-y-4">
										<ConnectButton />
										<p className="text-center text-muted-foreground text-xs">
											Connect your wallet to access tasks, shop, and rewards
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<Card>
							<CardHeader>
								<CardTitle className="text-base">Event Status</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Status</span>
									<span className="font-medium capitalize">{event.status}</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Duration</span>
									<span className="font-medium">3 days</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Type</span>
									<span className="font-medium">Music Festival</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
