"use client";

import {
	Home,
	Trophy,
	CreditCard,
	Settings,
	QrCode,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { cn } from "~/lib/utils";

export function MobileNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { address } = useAccount();

	// Check if we're in an event-specific route
	const isEventRoute = pathname.includes("/events/") && pathname !== "/event";
	const eventSlug = isEventRoute
		? pathname.split("/events/")[1]?.split("/")[0]
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

	const navItems = isEventRoute && eventInfo
		? [
				{
					name: "Home",
					href: `/events/${eventInfo.slug}`,
					icon: Home,
					active: pathname === `/events/${eventInfo.slug}`,
				},
				{
					name: "Progress",
					href: `/events/${eventInfo.slug}/tasks`,
					icon: Trophy,
					active: pathname === `/events/${eventInfo.slug}/tasks`,
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
					href: "/events",
					icon: Home,
					active: pathname === "/events",
				},
			];

	const handleScanPay = () => {
		if (isEventRoute && eventInfo) {
			router.push(`/events/${eventInfo.slug}/scan`);
		} else {
			router.push("/scan");
		}
	};

	return (
		<>
			{/* Floating ScanPay Button - Now visible on all pages */}
			<button
				type="button"
				onClick={handleScanPay}
				className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 transform group md:hidden"
				aria-label="Scan & Pay"
			>
				<div className="relative">
					{/* Pulse animation */}
					<div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
					{/* Button shadow */}
					<div className="absolute inset-0 rounded-full bg-primary/30 blur-xl" />
					{/* Button */}
					<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all duration-200 hover:scale-110 active:scale-95">
						<QrCode className="h-7 w-7" strokeWidth={2.5} />
					</div>
					{/* Tooltip */}
					<span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/90 px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100">
						Scan & Pay
					</span>
				</div>
			</button>

			{/* Navigation Bar */}
			<div className="fixed right-0 bottom-0 left-0 border-t bg-card md:hidden z-50">
				{isEventRoute && eventInfo && (
					<div className="border-b bg-muted/30 px-4 py-2">
						<div className="flex items-center justify-between">
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-xs">{eventInfo.name}</p>
							</div>
							<Link
								href="/"
								className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-200"
							>
								Change
							</Link>
						</div>
					</div>
				)}
				<div className="grid grid-cols-4 py-2">
					{navItems.map((item, index) => (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"relative flex flex-col items-center justify-center py-3 text-xs transition-all duration-200 active:scale-95",
								item.active
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
								// Add margin for the center floating button
								index === 1 && "mr-4",
								index === 2 && "ml-4",
							)}
						>
							{item.active && (
								<div className="absolute inset-x-2 inset-y-1 rounded-xl bg-primary/10" />
							)}
							<item.icon className="relative h-6 w-6" />
						</Link>
					))}
				</div>
				{address && (
					<div className="pb-safe pb-1 text-center text-muted-foreground text-xs">
						{address.slice(0, 6)}...{address.slice(-4)}
					</div>
				)}
			</div>
		</>
	);
}
