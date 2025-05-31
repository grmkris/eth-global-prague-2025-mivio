"use client";

import {
	ArrowLeft,
	Calendar,
	CreditCard,
	HelpCircle,
	Home,
	LogOut,
	QrCode,
	Trophy,
	Settings,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import ConnectButton from "~/components/connect-button";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useUser } from "~/components/user-provider";

export function DesktopNav() {
	const pathname = usePathname();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();
	const { user } = useUser();

	// Check if we're in an event-specific route
	const isEventRoute = pathname.includes("/events/") && pathname !== "/event";
	const eventSlug = isEventRoute
		? pathname.split("/events/")[1]?.split("/")[0]
		: null;

	// Try to get event info from the path for now (in a real app, this would come from context or API)
	const eventInfo = eventSlug
		? {
				slug: eventSlug,
				name: eventSlug
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" "),
			}
		: null;

	const navItems =
		isEventRoute && eventInfo
			? [
					{
						name: "Home",
						href: `/events/${eventInfo.slug}`,
						icon: Home,
						active: pathname === `/events/${eventInfo.slug}`,
					},
					{
						name: "Tasks",
						href: `/events/${eventInfo.slug}/tasks`,
						icon: Trophy,
						active: pathname === `/events/${eventInfo.slug}/tasks`,
					},
					{
						name: "Scan",
						href: `/events/${eventInfo.slug}/scan`,
						icon: QrCode,
						active: pathname === `/events/${eventInfo.slug}/scan`,
					},
					{
						name: "Wallet",
						href: `/events/${eventInfo.slug}/wallet`,
						icon: CreditCard,
						active: pathname === `/events/${eventInfo.slug}/wallet`,
					},
					{
						name: "Profile",
						href: `/events/${eventInfo.slug}/profile`,
						icon: Settings,
						active: pathname === `/events/${eventInfo.slug}/profile`,
					},
				]
			: [
					{
						name: "Events",
						href: "/event",
						icon: Calendar,
						active: pathname === "/event" || pathname.startsWith("/events/"),
					},
				];

	return (
		<div className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-card p-4 md:flex">
			<div className="mb-8 px-2">
				{address ? (
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage 
								src={user?.avatar || "/placeholder.svg?height=40&width=40"} 
								alt={user?.name || "User"} 
							/>
							<AvatarFallback className="bg-primary/10 text-primary">
								<User className="h-5 w-5" />
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<h2 className="font-semibold text-base">
								Hello, {user?.displayName || "there"}!
							</h2>
							<p className="text-muted-foreground text-sm font-light">
								Your Festival Hub
							</p>
						</div>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Calendar className="h-4 w-4 text-primary" />
						</div>
						<h1 className="font-bold text-xl">Mivio</h1>
					</div>
				)}
			</div>

			{isEventRoute && eventInfo && (
				<div className="mb-6 border-b px-2 pb-4">
					<Link
						href="/"
						className="mb-2 flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
					>
						<ArrowLeft className="h-3 w-3" />
						Change Event
					</Link>
					<div className="space-y-1">
						<h2 className="line-clamp-1 font-semibold text-sm">
							{eventInfo.name}
						</h2>
					</div>
				</div>
			)}

			<nav className="space-y-2">
				{navItems.map((item) => (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							"flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
							item.active
								? "bg-primary/90 text-primary-foreground"
								: "hover:bg-accent hover:text-accent-foreground",
						)}
					>
						<item.icon className="h-5 w-5" />
						{item.name}
					</Link>
				))}
			</nav>

			<div className="mt-auto space-y-4">
				{address ? (
					<div className="space-y-2 px-3 py-2">
						<div className="text-muted-foreground text-xs">
							Connected Wallet
						</div>
						<div className="font-mono text-sm">
							{address.slice(0, 6)}...{address.slice(-4)}
						</div>
						<Button
							variant="outline"
							size="sm"
							className="w-full"
							onClick={() => disconnect()}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Disconnect
						</Button>
					</div>
				) : (
					<div className="px-3">
						<ConnectButton />
					</div>
				)}

				<Button variant="ghost" className="w-full justify-start gap-3">
					<HelpCircle className="h-5 w-5" />
					Help & Support
				</Button>

				<div className="flex justify-center px-3">
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	);
}
