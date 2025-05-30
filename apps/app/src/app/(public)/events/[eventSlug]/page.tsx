import { PublicEventDetail } from "~/components/public-event-detail";

export default async function PublicEventPage({
	params,
}: {
	params: Promise<{ eventSlug: string }>;
}) {
	const { eventSlug } = await params;
	return <PublicEventDetail eventSlug={eventSlug} />;
}
