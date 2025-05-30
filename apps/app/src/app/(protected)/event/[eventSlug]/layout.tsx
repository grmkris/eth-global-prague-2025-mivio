import { EventProvider } from "~/components/event-provider";

export default async function EventLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ eventSlug: string }>;
}) {
	const { eventSlug } = await params;

	return <EventProvider eventSlug={eventSlug}>{children}</EventProvider>;
}
