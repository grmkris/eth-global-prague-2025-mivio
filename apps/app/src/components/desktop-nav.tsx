"use client";

import {
	ArrowLeft,
	Calendar,
	CheckSquare,
	CreditCard,
	HelpCircle,
	Home,
	LogOut,
	ShoppingBag,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import ConnectButton from "~/components/connect-button";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function DesktopNav() {
	const pathname = usePathname();
	const { address } = useAccount();
	const { disconnect } = useDisconnect();

	// Check if we're in an event-specific route
	const isEventRoute = pathname.includes("/event/");
	const eventSlug = isEventRoute
		? pathname.split("/event/")[1]?.split("/")[0]
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
						name: "Overview",
						href: `/event/${eventInfo.slug}`,
						icon: Home,
						active: pathname === `/event/${eventInfo.slug}`,
					},
					{
						name: "Tasks",
						href: `/event/${eventInfo.slug}/tasks`,
						icon: CheckSquare,
						active: pathname === `/event/${eventInfo.slug}/tasks`,
					},
					{
						name: "Wallet",
						href: `/event/${eventInfo.slug}/wallet`,
						icon: CreditCard,
						active: pathname === `/event/${eventInfo.slug}/wallet`,
					},
					{
						name: "Shop",
						href: `/event/${eventInfo.slug}/shop`,
						icon: ShoppingBag,
						active: pathname === `/event/${eventInfo.slug}/shop`,
					},
					{
						name: "Profile",
						href: `/event/${eventInfo.slug}/profile`,
						icon: User,
						active: pathname === `/event/${eventInfo.slug}/profile`,
					},
				]
			: [
					{
						name: "Events",
						href: "/events",
						icon: Calendar,
						active: pathname === "/events" || pathname.startsWith("/events/"),
					},
				];

	return (
		<div className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-card p-4 md:flex">
			<div className="mb-8 flex items-center gap-2 px-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
					<Home className="h-4 w-4 text-primary-foreground" />
				</div>
				<h1 className="font-bold text-xl">Mivio</h1>
			</div>

			{isEventRoute && eventInfo && (
				<div className="mb-6 border-b px-2 pb-4">
					<Link
						href="/events"
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
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
							item.active
								? "bg-primary text-primary-foreground"
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
