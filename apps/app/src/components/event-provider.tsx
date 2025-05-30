"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Event = {
  id: string
  slug: string
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
  bannerImage: string
  status: "upcoming" | "active" | "completed"
}

type EventContextType = {
  event: Event | null
  loading: boolean
  error: string | null
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ 
  eventSlug,
  children 
}: { 
  eventSlug: string
  children: React.ReactNode 
}) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock API call - in real app, this would fetch from your API
    const fetchEvent = async () => {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data
      const events: Event[] = [
        {
          id: "1",
          slug: "eth-global-prague-2025",
          name: "ETHGlobal Prague 2025",
          description: "Join the largest Ethereum hackathon in Central Europe.",
          location: "Prague Congress Centre, Czech Republic",
          startDate: "2025-02-14",
          endDate: "2025-02-16",
          bannerImage: "/placeholder.svg?height=200&width=400",
          status: "active"
        },
        {
          id: "2",
          slug: "web3-summit-berlin",
          name: "Web3 Summit Berlin",
          description: "The premier conference for decentralized web infrastructure.",
          location: "Berlin, Germany",
          startDate: "2025-03-20",
          endDate: "2025-03-22",
          bannerImage: "/placeholder.svg?height=200&width=400",
          status: "upcoming"
        },
        {
          id: "3",
          slug: "defi-conf-london",
          name: "DeFi Conference London",
          description: "Explore the latest innovations in decentralized finance.",
          location: "London, UK",
          startDate: "2025-01-10",
          endDate: "2025-01-11",
          bannerImage: "/placeholder.svg?height=200&width=400",
          status: "completed"
        }
      ]
      
      const foundEvent = events.find(e => e.slug === eventSlug)
      
      if (foundEvent) {
        setEvent(foundEvent)
      } else {
        setError("Event not found")
        router.push("/events")
      }
      
      setLoading(false)
    }

    fetchEvent()
  }, [eventSlug, router])

  return (
    <EventContext.Provider value={{ event, loading, error }}>
      {children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider")
  }
  return context
} 