"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { CheckSquare, CreditCard, ShoppingBag, User } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

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
    <div className="md:hidden border-t bg-card fixed bottom-0 left-0 right-0 z-10">
      <nav className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center py-3 px-5 text-xs",
              item.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className={cn("h-6 w-6 mb-1", item.active ? "text-primary" : "text-muted-foreground")} />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
