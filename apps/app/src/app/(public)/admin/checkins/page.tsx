"use client";

import {
	ArrowLeft,
	Clock,
	Edit,
	Eye,
	MapPin,
	Plus,
	QrCode,
	Trophy,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QRCodeGenerator } from "~/components/qr-code-generator";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

type CheckinLocation = {
	id: string;
	name: string;
	description: string;
	location: string;
	points: number;
	active: boolean;
	checkinCount: number;
	lastCheckin: Date | null;
	category: "entrance" | "booth" | "stage" | "food" | "sponsor";
};

export default function AdminCheckinsPage() {
	const [selectedLocation, setSelectedLocation] =
		useState<CheckinLocation | null>(null);
	const [showQRModal, setShowQRModal] = useState(false);

	const locations: CheckinLocation[] = [
		{
			id: "loc-1",
			name: "Main Entrance",
			description: "Primary event entrance - welcome check-in",
			location: "Front Lobby",
			points: 10,
			active: true,
			checkinCount: 234,
			lastCheckin: new Date(Date.now() - 5 * 60000),
			category: "entrance",
		},
		{
			id: "loc-2",
			name: "Main Stage Area",
			description: "Check in when attending main stage presentations",
			location: "Hall A - Main Stage",
			points: 20,
			active: true,
			checkinCount: 156,
			lastCheckin: new Date(Date.now() - 15 * 60000),
			category: "stage",
		},
		{
			id: "loc-3",
			name: "Sponsor Booth #1",
			description: "Visit our platinum sponsor's interactive booth",
			location: "Exhibition Hall - Booth A1",
			points: 50,
			active: true,
			checkinCount: 89,
			lastCheckin: new Date(Date.now() - 30 * 60000),
			category: "sponsor",
		},
		{
			id: "loc-4",
			name: "Food Court Central",
			description: "Central dining area check-in for social rewards",
			location: "Food Court - Central Area",
			points: 15,
			active: true,
			checkinCount: 123,
			lastCheckin: new Date(Date.now() - 45 * 60000),
			category: "food",
		},
		{
			id: "loc-5",
			name: "Innovation Showcase",
			description: "Check in at the startup showcase area",
			location: "Hall B - Innovation Zone",
			points: 30,
			active: true,
			checkinCount: 67,
			lastCheckin: new Date(Date.now() - 60 * 60000),
			category: "booth",
		},
		{
			id: "loc-6",
			name: "Networking Lounge",
			description: "Premium networking area for speakers and VIPs",
			location: "VIP Floor - Lounge",
			points: 40,
			active: true,
			checkinCount: 34,
			lastCheckin: new Date(Date.now() - 90 * 60000),
			category: "booth",
		},
		{
			id: "loc-7",
			name: "Workshop Room C",
			description: "Technical workshop and hands-on sessions",
			location: "Workshop Wing - Room C",
			points: 25,
			active: false,
			checkinCount: 45,
			lastCheckin: new Date(Date.now() - 180 * 60000),
			category: "stage",
		},
		{
			id: "loc-8",
			name: "Exit Survey Station",
			description: "Final check-out and feedback collection",
			location: "Exit Lobby",
			points: 20,
			active: true,
			checkinCount: 12,
			lastCheckin: new Date(Date.now() - 120 * 60000),
			category: "entrance",
		},
	];

	const generateCheckinQR = (location: CheckinLocation) => {
		setSelectedLocation(location);
		setShowQRModal(true);
	};

	const getQRData = (location: CheckinLocation) => {
		return JSON.stringify({
			type: "checkin",
			locationId: location.id,
			points: location.points,
			eventSlug: "eth-global-prague-2025",
			description: location.name,
		});
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "entrance":
				return "text-blue-500";
			case "booth":
				return "text-green-500";
			case "stage":
				return "text-purple-500";
			case "food":
				return "text-orange-500";
			case "sponsor":
				return "text-yellow-500";
			default:
				return "text-gray-500";
		}
	};

	const getCategoryLabel = (category: string) => {
		switch (category) {
			case "entrance":
				return "Entrance/Exit";
			case "booth":
				return "Exhibition Booth";
			case "stage":
				return "Presentation Area";
			case "food":
				return "Food & Beverage";
			case "sponsor":
				return "Sponsor Zone";
			default:
				return "Other";
		}
	};

	const totalCheckins = locations.reduce(
		(sum, loc) => sum + loc.checkinCount,
		0,
	);
	const activeLocations = locations.filter((loc) => loc.active).length;
	const totalPoints = locations.reduce(
		(sum, loc) => sum + loc.checkinCount * loc.points,
		0,
	);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-4">
						<Link href="/admin">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Check-in Points
							</h1>
							<p className="text-muted-foreground">
								Manage event locations and check-in QR codes
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<div className="text-center">
								<p className="font-bold text-2xl">{activeLocations}</p>
								<p className="text-muted-foreground text-sm">
									Active Locations
								</p>
							</div>
							<div className="text-center">
								<p className="font-bold text-2xl">{totalCheckins}</p>
								<p className="text-muted-foreground text-sm">Total Check-ins</p>
							</div>
							<div className="text-center">
								<p className="font-bold text-2xl">
									{totalPoints.toLocaleString()}
								</p>
								<p className="text-muted-foreground text-sm">Points Awarded</p>
							</div>
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Location
						</Button>
					</div>
				</div>

				{/* Locations Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{locations.map((location) => (
						<Card key={location.id} className="relative">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<CardTitle className="text-lg">{location.name}</CardTitle>
										<CardDescription>{location.description}</CardDescription>
									</div>
									<Badge variant={location.active ? "default" : "secondary"}>
										{location.active ? "Active" : "Inactive"}
									</Badge>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* Location Details */}
								<div className="space-y-2 text-sm">
									<div className="flex items-center gap-2">
										<MapPin className="h-3 w-3 text-muted-foreground" />
										<span className="text-muted-foreground">
											{location.location}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Trophy className="h-3 w-3 text-amber-500" />
										<span>{location.points} points per check-in</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Check-ins:</span>
										<span className="font-medium">{location.checkinCount}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">
											Last activity:
										</span>
										<div className="flex items-center gap-1">
											<Clock className="h-3 w-3 text-muted-foreground" />
											<span className="text-xs">
												{location.lastCheckin
													? `${Math.round((Date.now() - location.lastCheckin.getTime()) / 60000)}m ago`
													: "Never"}
											</span>
										</div>
									</div>
								</div>

								{/* Category Badge */}
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className={getCategoryColor(location.category)}
									>
										{getCategoryLabel(location.category)}
									</Badge>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => generateCheckinQR(location)}
										className="flex-1"
										disabled={!location.active}
									>
										<QrCode className="mr-2 h-3 w-3" />
										Check-in QR
									</Button>
									<Button variant="ghost" size="sm">
										<Edit className="h-3 w-3" />
									</Button>
									<Button variant="ghost" size="sm">
										<Eye className="h-3 w-3" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* QR Code Modal */}
				{selectedLocation && (
					<QRCodeGenerator
						data={getQRData(selectedLocation)}
						title={`Check-in: ${selectedLocation.name}`}
						description={`${selectedLocation.points} points - ${selectedLocation.location}`}
						open={showQRModal}
						onClose={() => setShowQRModal(false)}
					/>
				)}
			</div>
		</div>
	);
}
