import { EventProvider } from "~/components/event-provider"

export default function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { eventSlug: string }
}) {
  return (
    <EventProvider eventSlug={params.eventSlug}>
      {children}
    </EventProvider>
  )
} 