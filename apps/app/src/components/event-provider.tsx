"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

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
};

type EventContextType = {
	event: Event | null;
	loading: boolean;
	error: string | null;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({
	eventSlug,
	children,
}: {
	eventSlug: string;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [event, setEvent] = useState<Event | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Mock API call - in real app, this would fetch from your API
		const fetchEvent = async () => {
			setLoading(true);
			setError(null);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Mock data
			const events: Event[] = [
				{
					id: "1",
					slug: "coffee-festival-2025",
					name: "International Coffee Festival 2025",
					description:
						"Immerse yourself in the world of specialty coffee. Taste exotic blends, learn from master baristas.",
					location: "Convention Center, Seattle",
					startDate: "2025-09-12",
					endDate: "2025-09-14",
					bannerImage: "/coffee_festival.png",
					status: "active",
				},
				{
					id: "2",
					slug: "digital-art-exhibition",
					name: "Digital Art Exhibition",
					description:
						"Experience the future of art through immersive digital installations and interactive multimedia.",
					location: "Modern Art Museum, San Francisco",
					startDate: "2025-10-05",
					endDate: "2025-10-20",
					bannerImage: "/digital_art_exhibition.png",
					status: "upcoming",
				},
				{
					id: "3",
					slug: "synthwave-fest",
					name: "Synthwave Festival",
					description:
						"Step into a neon-lit retro-futuristic world with electronic beats and 80s-inspired visuals.",
					location: "Warehouse District, Los Angeles",
					startDate: "2025-08-23",
					endDate: "2025-08-24",
					bannerImage: "/synthwave_festival.png",
					status: "upcoming",
				},
			];

			const foundEvent = events.find((e) => e.slug === eventSlug);

			if (foundEvent) {
				setEvent(foundEvent);
			} else {
				setError("Event not found");
				router.push("/event");
			}

			setLoading(false);
		};

		fetchEvent();
	}, [eventSlug, router]);

	return (
		<EventContext.Provider value={{ event, loading, error }}>
			{children}
		</EventContext.Provider>
	);
}

export function useEvent() {
	const context = useContext(EventContext);
	if (context === undefined) {
		throw new Error("useEvent must be used within an EventProvider");
	}
	return context;
}
