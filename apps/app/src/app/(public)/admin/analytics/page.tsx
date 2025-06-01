"use client";

import {
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	BarChart3,
	Calendar,
	Clock,
	DollarSign,
	Eye,
	MapPin,
	QrCode,
	ShoppingBag,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function AdminAnalyticsPage() {
	const [timeRange, setTimeRange] = useState("7d");

	// Sample data for various charts
	const attendanceData = [
		{ time: "09:00", attendees: 45 },
		{ time: "10:00", attendees: 120 },
		{ time: "11:00", attendees: 180 },
		{ time: "12:00", attendees: 240 },
		{ time: "13:00", attendees: 320 },
		{ time: "14:00", attendees: 380 },
		{ time: "15:00", attendees: 450 },
		{ time: "16:00", attendees: 520 },
		{ time: "17:00", attendees: 480 },
		{ time: "18:00", attendees: 420 },
		{ time: "19:00", attendees: 350 },
		{ time: "20:00", attendees: 280 },
	];

	const dailyMetrics = [
		{ day: "Mon", checkins: 342, sales: 1250, tasks: 89 },
		{ day: "Tue", checkins: 456, sales: 1580, tasks: 112 },
		{ day: "Wed", checkins: 523, sales: 1890, tasks: 98 },
		{ day: "Thu", checkins: 612, sales: 2340, tasks: 134 },
		{ day: "Fri", checkins: 789, sales: 2890, tasks: 156 },
		{ day: "Sat", checkins: 934, sales: 3450, tasks: 178 },
		{ day: "Sun", checkins: 823, sales: 3120, tasks: 145 },
	];

	const revenueData = [
		{ month: "Jan", revenue: 12500, target: 15000 },
		{ month: "Feb", revenue: 18900, target: 15000 },
		{ month: "Mar", revenue: 23400, target: 18000 },
		{ month: "Apr", revenue: 28900, target: 20000 },
		{ month: "May", revenue: 34500, target: 25000 },
		{ month: "Jun", revenue: 42100, target: 30000 },
	];

	const locationData = [
		{ name: "Main Entrance", value: 2340, color: "#8884d8" },
		{ name: "Tasting Hall", value: 1560, color: "#82ca9d" },
		{ name: "Roaster Showcase", value: 890, color: "#ffc658" },
		{ name: "Barista Stage", value: 1230, color: "#ff7300" },
		{ name: "Coffee Lab", value: 670, color: "#00ff88" },
		{ name: "VIP Cupping", value: 340, color: "#8dd1e1" },
	];

	const taskCompletionData = [
		{ category: "Photo Challenge", completed: 145, total: 200 },
		{ category: "QR Hunt", completed: 230, total: 300 },
		{ category: "Taste Test", completed: 180, total: 250 },
		{ category: "Social Share", completed: 320, total: 400 },
		{ category: "Survey", completed: 89, total: 150 },
	];

	const topProducts = [
		{ name: "Premium Coffee Bundle", sales: 89, revenue: 4450 },
		{ name: "Event T-Shirt", sales: 156, revenue: 3120 },
		{ name: "Coffee Mug Set", sales: 203, revenue: 6090 },
		{ name: "Tasting Pass", sales: 78, revenue: 2340 },
		{ name: "Gift Card", sales: 145, revenue: 7250 },
	];

	const hourlyEngagement = [
		{ hour: "6 AM", engagement: 12 },
		{ hour: "8 AM", engagement: 45 },
		{ hour: "10 AM", engagement: 89 },
		{ hour: "12 PM", engagement: 156 },
		{ hour: "2 PM", engagement: 203 },
		{ hour: "4 PM", engagement: 178 },
		{ hour: "6 PM", engagement: 134 },
		{ hour: "8 PM", engagement: 89 },
		{ hour: "10 PM", engagement: 45 },
	];

	const keyMetrics = [
		{
			title: "Total Attendees",
			value: "2,847",
			change: "+12.5%",
			trend: "up",
			icon: Users,
			color: "text-blue-500",
		},
		{
			title: "Total Revenue",
			value: "$28,940",
			change: "+8.3%",
			trend: "up",
			icon: DollarSign,
			color: "text-green-500",
		},
		{
			title: "QR Scans",
			value: "5,234",
			change: "+15.7%",
			trend: "up",
			icon: QrCode,
			color: "text-purple-500",
		},
		{
			title: "Avg. Session",
			value: "4.2h",
			change: "-2.1%",
			trend: "down",
			icon: Clock,
			color: "text-orange-500",
		},
		{
			title: "Conversion Rate",
			value: "18.4%",
			change: "+3.2%",
			trend: "up",
			icon: TrendingUp,
			color: "text-pink-500",
		},
		{
			title: "Satisfaction",
			value: "4.8/5.0",
			change: "+0.2",
			trend: "up",
			icon: Eye,
			color: "text-indigo-500",
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-4">
						<Link href="/admin">
							<Button variant="ghost" size="sm">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Admin
							</Button>
						</Link>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
							<BarChart3 className="h-5 w-5 text-primary-foreground" />
						</div>
						<div>
							<h1 className="font-bold text-3xl">Analytics Dashboard</h1>
							<p className="text-muted-foreground">
								Real-time insights and performance metrics
							</p>
						</div>
					</div>

					{/* Time Range Selector */}
					<div className="flex items-center gap-4">
						<Select value={timeRange} onValueChange={setTimeRange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select time range" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1d">Last 24 hours</SelectItem>
								<SelectItem value="7d">Last 7 days</SelectItem>
								<SelectItem value="30d">Last 30 days</SelectItem>
								<SelectItem value="90d">Last 3 months</SelectItem>
							</SelectContent>
						</Select>
						<Badge variant="secondary" className="flex items-center gap-1">
							<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
							Live Data
						</Badge>
					</div>
				</div>

				{/* Key Metrics Grid */}
				<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					{keyMetrics.map((metric) => (
						<Card key={metric.title}>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<metric.icon className={`h-8 w-8 ${metric.color}`} />
									<div
										className={`flex items-center gap-1 text-sm ${
											metric.trend === "up"
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{metric.trend === "up" ? (
											<ArrowUp className="h-3 w-3" />
										) : (
											<ArrowDown className="h-3 w-3" />
										)}
										{metric.change}
									</div>
								</div>
								<div className="mt-2">
									<p className="font-bold text-2xl">{metric.value}</p>
									<p className="text-muted-foreground text-sm">
										{metric.title}
									</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Main Charts */}
				<Tabs defaultValue="overview" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="engagement">Engagement</TabsTrigger>
						<TabsTrigger value="revenue">Revenue</TabsTrigger>
						<TabsTrigger value="locations">Locations</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-6">
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Real-time Attendance */}
							<Card>
								<CardHeader>
									<CardTitle>Real-time Attendance</CardTitle>
									<CardDescription>
										Current attendees throughout the day
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<AreaChart data={attendanceData}>
											<defs>
												<linearGradient
													id="colorAttendees"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#8884d8"
														stopOpacity={0.8}
													/>
													<stop
														offset="95%"
														stopColor="#8884d8"
														stopOpacity={0}
													/>
												</linearGradient>
											</defs>
											<XAxis
												dataKey="time"
												axisLine={false}
												tickLine={false}
											/>
											<YAxis axisLine={false} tickLine={false} />
											<Tooltip />
											<Area
												type="monotone"
												dataKey="attendees"
												stroke="#8884d8"
												fillOpacity={1}
												fill="url(#colorAttendees)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Daily Metrics */}
							<Card>
								<CardHeader>
									<CardTitle>Weekly Performance</CardTitle>
									<CardDescription>
										Check-ins, sales, and task completions
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<BarChart data={dailyMetrics}>
											<XAxis
												dataKey="day"
												axisLine={false}
												tickLine={false}
											/>
											<YAxis axisLine={false} tickLine={false} />
											<Tooltip />
											<Bar dataKey="checkins" fill="#8884d8" />
											<Bar dataKey="sales" fill="#82ca9d" />
											<Bar dataKey="tasks" fill="#ffc658" />
										</BarChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>
						</div>

						{/* Task Completion Overview */}
						<Card>
							<CardHeader>
								<CardTitle>Task Completion Rates</CardTitle>
								<CardDescription>
									Progress across different task categories
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{taskCompletionData.map((task) => {
										const percentage = (task.completed / task.total) * 100;
										return (
											<div key={task.category} className="space-y-2">
												<div className="flex items-center justify-between">
													<span className="font-medium text-sm">
														{task.category}
													</span>
													<span className="text-muted-foreground text-sm">
														{task.completed}/{task.total} (
														{percentage.toFixed(1)}%)
													</span>
												</div>
												<div className="h-2 w-full rounded-full bg-muted">
													<div
														className="h-2 rounded-full bg-primary"
														style={{ width: `${percentage}%` }}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="engagement" className="space-y-6">
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Hourly Engagement */}
							<Card>
								<CardHeader>
									<CardTitle>Hourly Engagement</CardTitle>
									<CardDescription>
										User activity patterns throughout the day
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<LineChart data={hourlyEngagement}>
											<XAxis
												dataKey="hour"
												axisLine={false}
												tickLine={false}
											/>
											<YAxis axisLine={false} tickLine={false} />
											<Tooltip />
											<Line
												type="monotone"
												dataKey="engagement"
												stroke="#8884d8"
												strokeWidth={3}
												dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
											/>
										</LineChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Top Products */}
							<Card>
								<CardHeader>
									<CardTitle>Top Selling Products</CardTitle>
									<CardDescription>
										Best performing items in the store
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{topProducts.map((product, index) => (
											<div
												key={product.name}
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
														{index + 1}
													</div>
													<div>
														<p className="font-medium text-sm">
															{product.name}
														</p>
														<p className="text-muted-foreground text-xs">
															{product.sales} sales
														</p>
													</div>
												</div>
												<p className="font-semibold">
													${product.revenue.toLocaleString()}
												</p>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value="revenue" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Revenue vs Target</CardTitle>
								<CardDescription>
									Monthly revenue performance against targets
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={400}>
									<BarChart data={revenueData}>
										<XAxis dataKey="month" axisLine={false} tickLine={false} />
										<YAxis axisLine={false} tickLine={false} />
										<Tooltip />
										<Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
										<Bar dataKey="target" fill="#8884d8" name="Target" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="locations" className="space-y-6">
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Location Check-ins */}
							<Card>
								<CardHeader>
									<CardTitle>Check-ins by Location</CardTitle>
									<CardDescription>
										Distribution of check-ins across event areas
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ResponsiveContainer width="100%" height={300}>
										<PieChart>
											<Pie
												data={locationData}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
												label={({ name, percent }) =>
													`${name} ${(percent * 100).toFixed(0)}%`
												}
											>
												{locationData.map((entry, index) => (
													<Cell
														key={`cell-${entry.name}-${index}`}
														fill={entry.color}
													/>
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</CardContent>
							</Card>

							{/* Location Details */}
							<Card>
								<CardHeader>
									<CardTitle>Location Performance</CardTitle>
									<CardDescription>
										Detailed metrics for each location
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{locationData.map((location, index) => (
											<div
												key={location.name}
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-3">
													<div
														className="h-4 w-4 rounded-full"
														style={{ backgroundColor: location.color }}
													/>
													<div>
														<p className="font-medium text-sm">
															{location.name}
														</p>
														<p className="text-muted-foreground text-xs">
															{location.value} check-ins
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													<Badge variant="secondary">
														{((location.value / 7030) * 100).toFixed(1)}%
													</Badge>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>

				{/* Export Actions */}
				<div className="mt-8 flex justify-end gap-4">
					<Button variant="outline">
						<Calendar className="mr-2 h-4 w-4" />
						Schedule Report
					</Button>
					<Button>
						<ArrowDown className="mr-2 h-4 w-4" />
						Export Data
					</Button>
				</div>
			</div>
		</div>
	);
} 