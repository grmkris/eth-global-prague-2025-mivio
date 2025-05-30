"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { CheckSquare, CreditCard, Home, ShoppingBag, User, Calendar } from "lucide-react"
import { useAccount } from "wagmi"

export function MobileNav() {
  const pathname = usePathname()
  const { address } = useAccount()
  
  // Check if we're in an event-specific route
  const isEventRoute = pathname.includes('/event/')
  const eventSlug = isEventRoute ? pathname.split('/event/')[1]?.split('/')[0] : null
  
  // Try to get event info from the path for now
  const eventInfo = eventSlug ? {
    slug: eventSlug,
    name: eventSlug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  } : null

  const navItems = isEventRoute && eventInfo ? [
    {
      name: "Overview",
      href: `/event/${eventInfo.slug}`,
      icon: Home,
      active: pathname === `/event/${eventInfo.slug}`,
    },
    {
      name: "Tasks",
      href: `/event/${eventInfo.slug}/tasks`,
      icon: CheckSquare,
      active: pathname === `/event/${eventInfo.slug}/tasks`,
    },
    {
      name: "Wallet",
      href: `/event/${eventInfo.slug}/wallet`,
      icon: CreditCard,
      active: pathname === `/event/${eventInfo.slug}/wallet`,
    },
    {
      name: "Shop",
      href: `/event/${eventInfo.slug}/shop`,
      icon: ShoppingBag,
      active: pathname === `/event/${eventInfo.slug}/shop`,
    },
    {
      name: "Profile",
      href: `/event/${eventInfo.slug}/profile`,
      icon: User,
      active: pathname === `/event/${eventInfo.slug}/profile`,
    },
  ] : [
    {
      name: "Events",
      href: "/events",
      icon: Calendar,
      active: pathname === "/events" || pathname.startsWith("/events/"),
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
      {isEventRoute && eventInfo && (
        <div className="px-4 py-2 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{eventInfo.name}</p>
            </div>
            <Link
              href="/events"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Change
            </Link>
          </div>
        </div>
      )}
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-md text-xs transition-colors",
              item.active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </div>
      {address && (
        <div className="text-center text-xs text-muted-foreground pb-1">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      )}
    </div>
  )
}
