"use client"

import { useEvent } from "~/components/event-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { Calendar, MapPin, Trophy, Wallet, ShoppingBag, User, CheckSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export function EventDashboard() {
  const { event, loading, error } = useEvent()
  const router = useRouter()

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading event</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const navigationCards = [
    {
      title: "Tasks",
      description: "Complete tasks to earn rewards",
      icon: CheckSquare,
      href: `/event/${event.slug}/tasks`,
      color: "text-blue-500",
      stats: "5 available"
    },
    {
      title: "Shop",
      description: "Spend your EventCoins",
      icon: ShoppingBag,
      href: `/event/${event.slug}/shop`,
      color: "text-green-500",
      stats: "New items!"
    },
    {
      title: "Wallet",
      description: "Manage your funds",
      icon: Wallet,
      href: `/event/${event.slug}/wallet`,
      color: "text-purple-500",
      stats: "1,250 EC"
    },
    {
      title: "Profile",
      description: "View achievements",
      icon: User,
      href: `/event/${event.slug}/profile`,
      color: "text-orange-500",
      stats: "Level 3"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <div className="aspect-[4/1] w-full">
          <img
            src={event.bannerImage}
            alt={event.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            {event.name}
          </h1>
          <p className="text-white/80 max-w-2xl">{event.description}</p>
        </div>
      </div>

      {/* Event Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Event Level</span>
              </div>
              <span className="text-sm font-bold">Level 3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Balance</span>
              </div>
              <span className="text-sm font-bold">1,250 EC</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Tasks</span>
              </div>
              <span className="text-sm font-bold">3/10 completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {navigationCards.map((card) => (
          <Card 
            key={card.title}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(card.href)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <card.icon className={`h-8 w-8 ${card.color}`} />
                <span className="text-xs text-muted-foreground">{card.stats}</span>
              </div>
              <CardTitle className="text-lg">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
} 