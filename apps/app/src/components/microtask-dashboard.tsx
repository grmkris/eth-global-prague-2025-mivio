"use client"

import { useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { CheckCircle2, MapPin, QrCode, Trophy } from "lucide-react"
import { RewardModal } from "~/components/reward-modal"

type Task = {
  id: string
  title: string
  description: string
  location: string
  reward: string
  rewardType: "token" | "badge" | "perk"
  progress: number
  completed: boolean
  type: "visit" | "scan" | "interact"
}

export function MicrotaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Visit Main Stage",
      description: "Check out the keynote presentation at the main stage",
      location: "Main Stage - Hall A",
      reward: "50 EventCoins",
      rewardType: "token",
      progress: 0,
      completed: false,
      type: "visit",
    },
    {
      id: "task-2",
      title: "Scan QR at Partner Booth",
      description: "Visit our partner's booth and scan their QR code",
      location: "Booth #42 - Exhibition Hall",
      reward: "Early Access Badge",
      rewardType: "badge",
      progress: 0,
      completed: false,
      type: "scan",
    },
    {
      id: "task-3",
      title: "Attend Workshop",
      description: "Join the interactive workshop on Web3 basics",
      location: "Workshop Room C",
      reward: "Free Drink Voucher",
      rewardType: "perk",
      progress: 0,
      completed: false,
      type: "interact",
    },
    {
      id: "task-4",
      title: "Network with Speakers",
      description: "Connect with at least 3 speakers at the networking area",
      location: "Networking Lounge",
      reward: "100 EventCoins",
      rewardType: "token",
      progress: 33,
      completed: false,
      type: "interact",
    },
    {
      id: "task-5",
      title: "Product Demo",
      description: "Watch the live product demonstration",
      location: "Demo Area - Hall B",
      reward: "Exclusive NFT",
      rewardType: "badge",
      progress: 100,
      completed: true,
      type: "visit",
    },
  ])

  const [showRewardModal, setShowRewardModal] = useState(false)
  const [currentReward, setCurrentReward] = useState<Task | null>(null)

  const completeTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const completedTask = { ...task, progress: 100, completed: true }
          setCurrentReward(completedTask)
          setShowRewardModal(true)
          return completedTask
        }
        return task
      }),
    )
  }

  const activeTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">Complete tasks to earn rewards at the event</p>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium">Your Progress</h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={(completedTasks.length / tasks.length) * 100} className="w-24 md:w-40" />
          <span className="text-sm font-medium">{Math.round((completedTasks.length / tasks.length) * 100)}%</span>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Tasks ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {activeTasks.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">All Tasks Completed!</h3>
              <p className="text-muted-foreground">Great job! You've completed all available tasks.</p>
            </div>
          ) : (
            activeTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge variant={task.type === "visit" ? "default" : task.type === "scan" ? "secondary" : "outline"}>
                      {task.type === "visit" ? "Visit" : task.type === "scan" ? "Scan QR" : "Interact"}
                    </Badge>
                  </div>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {task.location}
                  </div>

                  {task.progress > 0 && task.progress < 100 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                    <span>Reward: {task.reward}</span>
                  </div>

                  {task.type === "scan" ? (
                    <Button size="sm" onClick={() => completeTask(task.id)}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Scan QR
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => completeTask(task.id)}>
                      Complete
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No Completed Tasks Yet</h3>
              <p className="text-muted-foreground">Complete tasks to see them here</p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <Card key={task.id} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                    <span>Earned: {task.reward}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {showRewardModal && currentReward && (
        <RewardModal reward={currentReward} open={showRewardModal} onClose={() => setShowRewardModal(false)} />
      )}
    </div>
  )
}
