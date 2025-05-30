"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { address, isConnecting } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!address && !isConnecting) {
      router.push("/login")
    }
  }, [address, isConnecting, router])

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Connecting wallet...</p>
        </div>
      </div>
    )
  }

  if (!address) {
    return null
  }

  return <>{children}</>
} 