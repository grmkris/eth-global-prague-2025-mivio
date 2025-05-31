"use client";

import { Calendar, MapPin, QrCode, Ticket } from "lucide-react";
import { BottomNavigation } from "~/components/bottom-navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { WalletGuard } from "~/components/wallet-guard";

export default function TicketsPage() {
	const tickets = [
		{
			id: "1",
			eventName: "Synthwave Fest",
			date: "Jun 8-10, 2025",
			location: "Berlin",
			status: "upcoming",
			ticketType: "VIP Pass",
			bannerImage: "/synthwave_festival.png",
		},
		{
			id: "2",
			eventName: "Coffee Carnival",
			date: "Jul 15, 2025",
			location: "Online",
			status: "upcoming",
			ticketType: "General Admission",
			bannerImage: "/coffee_festival.png",
		},
		{
			id: "3",
			eventName: "Digital Art Exhibition",
			date: "Mar 20-22, 2025",
			location: "San Francisco",
			status: "past",
			ticketType: "Weekend Pass",
			bannerImage: "/digital_art_exhibition.png",
		},
	];

	return (
		<WalletGuard>
			<div className="min-h-screen pb-20">
				<div className="p-4">
					<h1 className="mb-6 font-bold text-2xl">My Tickets</h1>

					<div className="space-y-4">
						{tickets.map((ticket) => (
							<Card
								key={ticket.id}
								className={`overflow-hidden ${ticket.status === "past" ? "opacity-60" : ""}`}
							>
								<div className="relative h-32 overflow-hidden bg-muted">
									<img
										src={ticket.bannerImage}
										alt={ticket.eventName}
										className="h-full w-full object-cover"
									/>
									<div className="absolute top-3 right-3 rounded-lg bg-background/80 p-2 backdrop-blur-sm">
										<QrCode className="h-8 w-8 text-foreground" />
									</div>
								</div>
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-lg">
												{ticket.eventName}
											</CardTitle>
											<Badge
												variant={
													ticket.status === "upcoming" ? "default" : "secondary"
												}
												className="mt-2"
											>
												{ticket.ticketType}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<Calendar className="h-4 w-4" />
										<span>{ticket.date}</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<MapPin className="h-4 w-4" />
										<span>{ticket.location}</span>
									</div>
									{ticket.status === "upcoming" && (
										<Button className="mt-3 w-full" size="sm">
											View Ticket
										</Button>
									)}
								</CardContent>
							</Card>
						))}
					</div>

					<Card className="mt-6 border-dashed">
						<CardContent className="p-6 text-center">
							<Ticket className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
							<p className="mb-3 text-muted-foreground text-sm">
								Looking for more events?
							</p>
							<Button variant="outline">Browse Events</Button>
						</CardContent>
					</Card>
				</div>
			</div>
			<BottomNavigation />
		</WalletGuard>
	);
}
