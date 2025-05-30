"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { CheckSquare, CreditCard, HelpCircle, Home, ShoppingBag, User, LogOut, Calendar, ArrowLeft } from "lucide-react"
import { useAccount, useDisconnect } from "wagmi"
import ConnectButton from "~/components/connect-button"
import { ThemeSwitcher } from "~/components/theme-switcher"

export function DesktopNav() {
  const pathname = usePathname()
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  
  // Check if we're in an event-specific route
  const isEventRoute = pathname.includes('/event/')
  const eventSlug = isEventRoute ? pathname.split('/event/')[1]?.split('/')[0] : null
  
  // Try to get event info from the path for now (in a real app, this would come from context or API)
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
    <div className="hidden md:flex flex-col w-64 border-r bg-card p-4 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Home className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">Mivio</h1>
      </div>

      {isEventRoute && eventInfo && (
        <div className="mb-6 px-2 pb-4 border-b">
          <Link 
            href="/events" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Change Event
          </Link>
          <div className="space-y-1">
            <h2 className="font-semibold text-sm line-clamp-1">{eventInfo.name}</h2>
          </div>
        </div>
      )}

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              item.active ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {address ? (
          <div className="px-3 py-2 space-y-2">
            <div className="text-xs text-muted-foreground">Connected Wallet</div>
            <div className="text-sm font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => disconnect()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="px-3">
            <ConnectButton />
          </div>
        )}
        
        <Button variant="ghost" className="w-full justify-start gap-3">
          <HelpCircle className="h-5 w-5" />
          Help & Support
        </Button>
        
        <div className="px-3 flex justify-center">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  )
}
