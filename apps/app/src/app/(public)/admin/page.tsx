"use client";

import {
	CheckSquare,
	CreditCard,
	QrCode,
	Settings,
	ShoppingBag,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

export default function AdminPage() {
	const adminSections = [
		{
			title: "Task Management",
			description: "Create and manage event tasks with QR codes",
			icon: CheckSquare,
			href: "/admin/tasks",
			color: "text-blue-500",
			stats: "5 active tasks",
		},
		{
			title: "Merchant Store",
			description: "Manage store items and generate payment QR codes",
			icon: ShoppingBag,
			href: "/admin/store",
			color: "text-green-500",
			stats: "12 products",
		},
		{
			title: "POS System",
			description: "Point of sale with custom amount QR generation",
			icon: CreditCard,
			href: "/admin/pos",
			color: "text-purple-500",
			stats: "Custom amounts",
		},
		{
			title: "Check-in Points",
			description: "Manage event locations and check-in QR codes",
			icon: Users,
			href: "/admin/checkins",
			color: "text-orange-500",
			stats: "8 locations",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
			<div className="container mx-auto px-4 py-12">
				{/* Header */}
				<div className="mb-12 text-center">
					<div className="mb-4 flex items-center justify-center gap-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
							<Settings className="h-6 w-6 text-primary-foreground" />
						</div>
						<h1 className="font-bold text-4xl tracking-tight">
							Admin Dashboard
						</h1>
					</div>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Manage event tasks, store items, and generate QR codes for testing
						the event platform
					</p>
				</div>

				{/* Quick Stats */}
				<div className="mb-8 grid gap-4 md:grid-cols-4">
					<Card>
						<CardContent className="p-4 text-center">
							<QrCode className="mx-auto mb-2 h-8 w-8 text-primary" />
							<p className="font-bold text-2xl">1,247</p>
							<p className="text-muted-foreground text-sm">
								QR Codes Generated
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<CheckSquare className="mx-auto mb-2 h-8 w-8 text-blue-500" />
							<p className="font-bold text-2xl">85</p>
							<p className="text-muted-foreground text-sm">Tasks Completed</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<ShoppingBag className="mx-auto mb-2 h-8 w-8 text-green-500" />
							<p className="font-bold text-2xl">342</p>
							<p className="text-muted-foreground text-sm">Items Sold</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<Users className="mx-auto mb-2 h-8 w-8 text-orange-500" />
							<p className="font-bold text-2xl">156</p>
							<p className="text-muted-foreground text-sm">Check-ins</p>
						</CardContent>
					</Card>
				</div>

				{/* Admin Sections */}
				<div className="grid gap-6 md:grid-cols-2">
					{adminSections.map((section) => (
						<Card
							key={section.title}
							className="hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
						>
							<CardHeader>
								<div className="flex items-center justify-between">
									<section.icon className={`h-10 w-10 ${section.color}`} />
									<span className="text-muted-foreground text-xs">
										{section.stats}
									</span>
								</div>
								<CardTitle className="text-xl">{section.title}</CardTitle>
								<CardDescription>{section.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Link href={section.href}>
									<Button className="w-full" size="lg">
										Open {section.title}
									</Button>
								</Link>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Demo Note */}
				<div className="mt-12 rounded-lg border-2 border-muted-foreground/20 border-dashed p-6 text-center">
					<h3 className="mb-2 font-semibold text-lg">Demo Mode</h3>
					<p className="text-muted-foreground">
						This admin dashboard is for demonstration purposes. Use it to
						generate QR codes and test the event platform functionality.
					</p>
				</div>
			</div>
		</div>
	);
}
