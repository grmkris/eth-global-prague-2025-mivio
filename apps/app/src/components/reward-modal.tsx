"use client"

import { useEffect, useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Trophy, Sparkles, Award, Gift } from "lucide-react"
import confetti from "canvas-confetti"

type RewardModalProps = {
  reward: {
    title: string
    reward: string
    rewardType: "token" | "badge" | "perk"
  }
  open: boolean
  onClose: () => void
}

export function RewardModal({ reward, open, onClose }: RewardModalProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (open) {
      // Trigger confetti animation
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
        })

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42"],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        } else {
          setTimeout(() => setAnimationComplete(true), 500)
        }
      }

      frame()
    }

    return () => {
      setAnimationComplete(false)
    }
  }, [open])

  const RewardIcon = reward.rewardType === "token" ? Trophy : reward.rewardType === "badge" ? Award : Gift

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto my-4 bg-primary/10 p-3 rounded-full">
            <RewardIcon
              className={`h-12 w-12 ${
                reward.rewardType === "token"
                  ? "text-amber-500"
                  : reward.rewardType === "badge"
                    ? "text-blue-500"
                    : "text-green-500"
              }`}
            />
          </div>
          <DialogTitle className="text-xl sm:text-2xl flex justify-center items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Reward Earned!
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            You've completed <span className="font-medium">{reward.title}</span> and earned:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <Badge
            className="text-lg py-2 px-4 mb-2"
            variant={
              reward.rewardType === "token" ? "default" : reward.rewardType === "badge" ? "secondary" : "outline"
            }
          >
            {reward.reward}
          </Badge>

          <p className="text-sm text-muted-foreground mt-2">
            {reward.rewardType === "token"
              ? "Tokens have been added to your wallet"
              : reward.rewardType === "badge"
                ? "Badge has been added to your profile"
                : "Perk is now available in your rewards section"}
          </p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto">
            {animationComplete ? "Awesome!" : "Loading..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
