"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ConnectButton from "~/components/connect-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Wallet } from "lucide-react"

export default function LoginPage() {
  const { address } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (address) {
      router.push("/events")
    }
  }, [address, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="texture" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Mivio</CardTitle>
          <CardDescription>
            Connect your wallet to access events and start earning rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <ConnectButton />
          <p className="text-xs text-muted-foreground text-center">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 