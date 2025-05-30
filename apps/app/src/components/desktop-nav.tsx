"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { CheckSquare, CreditCard, HelpCircle, Home, ShoppingBag, User } from "lucide-react"

export function DesktopNav() {
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
    <div className="hidden md:flex flex-col w-64 border-r bg-card p-4 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Home className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold">EventBuddy</h1>
      </div>

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

      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <HelpCircle className="h-5 w-5" />
          Help & Support
        </Button>
      </div>
    </div>
  )
}
