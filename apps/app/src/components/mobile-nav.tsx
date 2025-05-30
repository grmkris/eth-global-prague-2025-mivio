"use client";

import {
	Calendar,
	CheckSquare,
	CreditCard,
	Home,
	ShoppingBag,
	User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { cn } from "~/lib/utils";

export function MobileNav() {
	const pathname = usePathname();
	const { address } = useAccount();

	// Check if we're in an event-specific route
	const isEventRoute = pathname.includes("/event/");
	const eventSlug = isEventRoute
		? pathname.split("/event/")[1]?.split("/")[0]
		: null;

	// Try to get event info from the path for now
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
		<div className="fixed right-0 bottom-0 left-0 border-t bg-card md:hidden">
			{isEventRoute && eventInfo && (
				<div className="border-b bg-muted/50 px-4 py-2">
					<div className="flex items-center justify-between">
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium text-xs">{eventInfo.name}</p>
						</div>
						<Link
							href="/events"
							className="text-muted-foreground text-xs hover:text-foreground"
						>
							Change
						</Link>
					</div>
				</div>
			)}
			<div className="flex items-center justify-around py-2">
				{navItems.map((item) => (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							"flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
							item.active
								? "text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						<item.icon className="h-5 w-5" />
						{item.name}
					</Link>
				))}
			</div>
			{address && (
				<div className="pb-1 text-center text-muted-foreground text-xs">
					{address.slice(0, 6)}...{address.slice(-4)}
				</div>
			)}
		</div>
	);
}
