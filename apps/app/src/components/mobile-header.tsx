"use client"

import { Home } from "lucide-react"
import { ThemeSwitcher } from "~/components/theme-switcher"

export function MobileHeader() {
  return (
    <div className="md:hidden sticky top-0 z-50 bg-card border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Mivio</h1>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  )
} 