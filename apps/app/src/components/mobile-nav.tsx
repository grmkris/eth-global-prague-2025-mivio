"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { CheckSquare, CreditCard, Home, ShoppingBag, User, Calendar } from "lucide-react"
import { useAccount } from "wagmi"
import { useEvent } from "~/components/event-provider"

export function MobileNav() {
  const pathname = usePathname()
  const { address } = useAccount()
  
  // Try to get event context - will be undefined if not in an event route
  let eventContext = null
  try {
    eventContext = useEvent()
  } catch {
    // Not in event context
  }

  const navItems = eventContext?.event ? [
    {
      name: "Overview",
      href: `/event/${eventContext.event.slug}`,
      icon: Home,
      active: pathname === `/event/${eventContext.event.slug}`,
    },
    {
      name: "Tasks",
      href: `/event/${eventContext.event.slug}/tasks`,
      icon: CheckSquare,
      active: pathname === `/event/${eventContext.event.slug}/tasks`,
    },
    {
      name: "Wallet",
      href: `/event/${eventContext.event.slug}/wallet`,
      icon: CreditCard,
      active: pathname === `/event/${eventContext.event.slug}/wallet`,
    },
    {
      name: "Shop",
      href: `/event/${eventContext.event.slug}/shop`,
      icon: ShoppingBag,
      active: pathname === `/event/${eventContext.event.slug}/shop`,
    },
    {
      name: "Profile",
      href: `/event/${eventContext.event.slug}/profile`,
      icon: User,
      active: pathname === `/event/${eventContext.event.slug}/profile`,
    },
  ] : [
    {
      name: "Events",
      href: "/events",
      icon: Calendar,
      active: pathname === "/events",
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
      {eventContext?.event && (
        <div className="px-4 py-2 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{eventContext.event.name}</p>
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
