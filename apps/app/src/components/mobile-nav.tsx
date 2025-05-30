"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { CheckSquare, CreditCard, Home, ShoppingBag, User } from "lucide-react"
import { useAccount } from "wagmi"

export function MobileNav() {
  const pathname = usePathname()
  const { address } = useAccount()

  const navItems = [
    {
      name: "Tasks",
      href: "/",
      icon: CheckSquare,
      active: pathname === "/",
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: CreditCard,
      active: pathname === "/wallet",
    },
    {
      name: "Shop",
      href: "/shop",
      icon: ShoppingBag,
      active: pathname === "/shop",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
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
