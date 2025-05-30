import { PublicEventDetail } from "~/components/public-event-detail"

export default function PublicEventPage({
  params,
}: {
  params: { eventSlug: string }
}) {
  return <PublicEventDetail eventSlug={params.eventSlug} />
} 