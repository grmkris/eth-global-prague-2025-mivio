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
					slug: "summer-music-fest-2025",
					name: "Summer Music Festival 2025",
					description:
						"The ultimate 3-day music experience featuring top artists across multiple genres.",
					location: "Central Park, New York",
					startDate: "2025-07-18",
					endDate: "2025-07-20",
					bannerImage: "/placeholder.svg?height=200&width=400",
					status: "active",
				},
				{
					id: "2",
					slug: "indie-rock-weekend",
					name: "Indie Rock Weekend",
					description:
						"Discover emerging indie artists and enjoy craft food & drinks in an intimate outdoor setting.",
					location: "Golden Gate Park, San Francisco",
					startDate: "2025-08-15",
					endDate: "2025-08-17",
					bannerImage: "/placeholder.svg?height=200&width=400",
					status: "upcoming",
				},
				{
					id: "3",
					slug: "jazz-blues-fest",
					name: "Jazz & Blues Festival",
					description:
						"Classic and contemporary jazz featuring renowned musicians and up-and-coming talent.",
					location: "Millennium Park, Chicago",
					startDate: "2025-06-10",
					endDate: "2025-06-12",
					bannerImage: "/placeholder.svg?height=200&width=400",
					status: "completed",
				},
			];

			const foundEvent = events.find((e) => e.slug === eventSlug);

			if (foundEvent) {
				setEvent(foundEvent);
			} else {
				setError("Event not found");
				router.push("/events");
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
