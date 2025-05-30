"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { CreditCard, QrCode, Smartphone } from "lucide-react"

type PaymentModalProps = {
  open: boolean
  onClose: () => void
  balance: string
  onPayment: (amount: number) => void
}

export function PaymentModal({ open, onClose, balance, onPayment }: PaymentModalProps) {
  const [amount, setAmount] = useState("100")
  const [paymentMethod, setPaymentMethod] = useState("qr")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      onPayment(Number.parseInt(amount))
      setIsProcessing(false)
    }, 1500)
  }

  const availableBalance = Number.parseInt(balance.replace(/,/g, ""))
  const isAmountValid = Number.parseInt(amount) > 0 && Number.parseInt(amount) <= availableBalance

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
          <DialogDescription>Pay for food, merchandise, or services at the event</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (EventCoins)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <p className="text-xs text-muted-foreground">Available balance: {balance} EC</p>
            {Number.parseInt(amount) > availableBalance && (
              <p className="text-xs text-red-500">Amount exceeds available balance</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <RadioGroup
              defaultValue="qr"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="grid grid-cols-3 gap-2"
            >
              <div>
                <RadioGroupItem value="qr" id="qr" className="peer sr-only" />
                <Label
                  htmlFor="qr"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <QrCode className="mb-3 h-6 w-6" />
                  QR Code
                </Label>
              </div>

              <div>
                <RadioGroupItem value="nfc" id="nfc" className="peer sr-only" />
                <Label
                  htmlFor="nfc"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="mb-3 h-6 w-6" />
                  Tap
                </Label>
              </div>

              <div>
                <RadioGroupItem value="manual" id="manual" className="peer sr-only" />
                <Label
                  htmlFor="manual"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-3 h-6 w-6" />
                  Manual
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={!isAmountValid || isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
