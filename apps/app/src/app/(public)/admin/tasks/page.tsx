"use client";

import {
	ArrowLeft,
	CheckSquare,
	Edit,
	Eye,
	MapPin,
	Plus,
	QrCode,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QRCodeGenerator } from "~/components/qr-code-generator";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

type Task = {
	id: string;
	title: string;
	description: string;
	location: string;
	reward: string;
	rewardType: "token" | "badge" | "perk";
	type: "visit" | "scan" | "interact";
	status: "active" | "inactive";
	completions: number;
};

export default function AdminTasksPage() {
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [showQRModal, setShowQRModal] = useState(false);

	const tasks: Task[] = [
		{
			id: "task-1",
			title: "Visit Main Stage",
			description: "Check out the keynote presentation at the main stage",
			location: "Main Stage - Hall A",
			reward: "50 EventCoins",
			rewardType: "token",
			type: "visit",
			status: "active",
			completions: 42,
		},
		{
			id: "task-2",
			title: "Scan QR at Partner Booth",
			description: "Visit our partner's booth and scan their QR code",
			location: "Booth #42 - Exhibition Hall",
			reward: "Early Access Badge",
			rewardType: "badge",
			type: "scan",
			status: "active",
			completions: 28,
		},
		{
			id: "task-3",
			title: "Attend Workshop",
			description: "Join the interactive workshop on Web3 basics",
			location: "Workshop Room C",
			reward: "Free Drink Voucher",
			rewardType: "perk",
			type: "interact",
			status: "active",
			completions: 15,
		},
		{
			id: "task-4",
			title: "Network with Speakers",
			description: "Connect with at least 3 speakers at the networking area",
			location: "Networking Lounge",
			reward: "100 EventCoins",
			rewardType: "token",
			type: "interact",
			status: "active",
			completions: 8,
		},
		{
			id: "task-5",
			title: "Product Demo",
			description: "Watch the live product demonstration",
			location: "Demo Area - Hall B",
			reward: "Exclusive NFT",
			rewardType: "badge",
			type: "visit",
			status: "inactive",
			completions: 67,
		},
	];

	const generateTaskQR = (task: Task) => {
		setSelectedTask(task);
		setShowQRModal(true);
	};

	const getQRData = (task: Task) => {
		return JSON.stringify({
			type: "task",
			taskId: task.id,
			eventSlug: "eth-global-prague-2025",
			description: task.title,
		});
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-4">
						<Link href="/admin">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Task Management
							</h1>
							<p className="text-muted-foreground">
								Create and manage event tasks with QR codes
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="text-center">
								<p className="font-bold text-2xl">
									{tasks.filter((t) => t.status === "active").length}
								</p>
								<p className="text-muted-foreground text-sm">Active Tasks</p>
							</div>
							<div className="text-center">
								<p className="font-bold text-2xl">
									{tasks.reduce((sum, t) => sum + t.completions, 0)}
								</p>
								<p className="text-muted-foreground text-sm">
									Total Completions
								</p>
							</div>
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add New Task
						</Button>
					</div>
				</div>

				{/* Tasks Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{tasks.map((task) => (
						<Card key={task.id} className="relative">
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<CardTitle className="text-lg">{task.title}</CardTitle>
										<CardDescription>{task.description}</CardDescription>
									</div>
									<Badge
										variant={task.status === "active" ? "default" : "secondary"}
									>
										{task.status}
									</Badge>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* Task Details */}
								<div className="space-y-2 text-sm">
									<div className="flex items-center gap-2">
										<MapPin className="h-3 w-3 text-muted-foreground" />
										<span className="text-muted-foreground">
											{task.location}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Trophy className="h-3 w-3 text-amber-500" />
										<span>{task.reward}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Completions:</span>
										<span className="font-medium">{task.completions}</span>
									</div>
								</div>

								{/* Task Type Badge */}
								<div className="flex items-center gap-2">
									<Badge
										variant={
											task.type === "visit"
												? "default"
												: task.type === "scan"
													? "secondary"
													: "outline"
										}
									>
										{task.type === "visit"
											? "Visit Location"
											: task.type === "scan"
												? "QR Scan Required"
												: "Interaction"}
									</Badge>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => generateTaskQR(task)}
										className="flex-1"
									>
										<QrCode className="mr-2 h-3 w-3" />
										Generate QR
									</Button>
									<Button variant="ghost" size="sm">
										<Edit className="h-3 w-3" />
									</Button>
									<Button variant="ghost" size="sm">
										<Eye className="h-3 w-3" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* QR Code Modal */}
				{selectedTask && (
					<QRCodeGenerator
						data={getQRData(selectedTask)}
						title={`Task: ${selectedTask.title}`}
						description="Users can scan this QR code to complete the task"
						open={showQRModal}
						onClose={() => setShowQRModal(false)}
					/>
				)}
			</div>
		</div>
	);
}
