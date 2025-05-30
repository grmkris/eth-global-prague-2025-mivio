"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { DesktopNav } from "~/components/desktop-nav"
import { MobileNav } from "~/components/mobile-nav"
import { MobileHeader } from "~/components/mobile-header"
import { useIsMobile } from "~/hooks/use-mobile"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background flex">
      {!isMobile && <DesktopNav />}
      <main className="flex-1 flex flex-col">
        {isMobile && <MobileHeader />}
        <div className="flex-1 container max-w-5xl mx-auto p-4 md:p-6">{children}</div>
        {isMobile && <MobileNav />}
      </main>
    </div>
  )
}
