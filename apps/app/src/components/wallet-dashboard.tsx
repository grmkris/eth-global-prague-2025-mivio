"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ArrowDownUp, ArrowUpRight, CreditCard, Plus, Wallet } from "lucide-react"
import { PaymentModal } from "~/components/payment-modal"
import { TopUpModal } from "~/components/top-up-modal"

type Transaction = {
  id: string
  type: "payment" | "reward" | "topup"
  amount: string
  description: string
  date: string
}

export function WalletDashboard() {
  const [balance, setBalance] = useState("1,250")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showTopUpModal, setShowTopUpModal] = useState(false)

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      type: "reward",
      amount: "+50",
      description: "Task Reward: Visit Main Stage",
      date: "Today, 2:30 PM",
    },
    {
      id: "tx-2",
      type: "payment",
      amount: "-200",
      description: "Food Purchase: Burger Combo",
      date: "Today, 1:15 PM",
    },
    {
      id: "tx-3",
      type: "topup",
      amount: "+500",
      description: "Wallet Top-up",
      date: "Today, 11:30 AM",
    },
    {
      id: "tx-4",
      type: "reward",
      amount: "+100",
      description: "Task Reward: Network with Speakers",
      date: "Yesterday, 4:45 PM",
    },
    {
      id: "tx-5",
      type: "payment",
      amount: "-150",
      description: "Merchandise: Event T-shirt",
      date: "Yesterday, 2:20 PM",
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and view transactions</p>
      </div>

      <Card className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Event Balance
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">Your available funds for the event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {balance} <span className="text-xl">EC</span>
          </div>
          <p className="text-primary-foreground/80 text-sm mt-1">EventCoins</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setShowPaymentModal(true)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Pay
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-primary-foreground hover:bg-primary-foreground/90"
            onClick={() => setShowTopUpModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Top Up
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      tx.type === "payment"
                        ? "bg-red-100 text-red-600"
                        : tx.type === "reward"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {tx.type === "payment" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownUp className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className={`font-medium ${tx.type === "payment" ? "text-red-600" : "text-green-600"}`}>
                  {tx.amount} EC
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4 mt-4">
          <div className="space-y-3">
            {transactions
              .filter((tx) => tx.type === "payment")
              .map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-100 text-red-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="font-medium text-red-600">{tx.amount} EC</div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 mt-4">
          <div className="space-y-3">
            {transactions
              .filter((tx) => tx.type === "reward" || tx.type === "topup")
              .map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      <ArrowDownUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="font-medium text-green-600">{tx.amount} EC</div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        balance={balance}
        onPayment={(amount) => {
          const newBalance = (Number.parseInt(balance.replace(/,/g, "")) - amount).toLocaleString()
          setBalance(newBalance)

          const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            type: "payment",
            amount: `-${amount}`,
            description: "Payment",
            date: "Just now",
          }

          setTransactions([newTx, ...transactions])
          setShowPaymentModal(false)
        }}
      />

      <TopUpModal
        open={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onTopUp={(amount) => {
          const newBalance = (Number.parseInt(balance.replace(/,/g, "")) + amount).toLocaleString()
          setBalance(newBalance)

          const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            type: "topup",
            amount: `+${amount}`,
            description: "Wallet Top-up",
            date: "Just now",
          }

          setTransactions([newTx, ...transactions])
          setShowTopUpModal(false)
        }}
      />
    </div>
  )
}
