"use client";

import { Home, CreditCard, Ticket, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const navItems = [
	{
		href: "/",
		icon: Home,
		label: "Home",
	},
	{
		href: "/wallet",
		icon: CreditCard,
		label: "Wallet",
	},
	{
		href: "/tickets",
		icon: Ticket,
		label: "Tickets",
	},
	{
		href: "/more",
		icon: LayoutGrid,
		label: "More",
	},
];

export function BottomNavigation() {
	const pathname = usePathname();

	return (
		<>
			{/* Bottom Navigation Bar */}
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
				<nav className="container mx-auto px-0">
					<ul className="flex items-center justify-around h-16">
						{navItems.map((item) => {
							const isActive = pathname === item.href || 
								(item.href !== "/" && pathname.startsWith(item.href));
							
							return (
								<li key={item.href} className="flex-1">
									<Link
										href={item.href}
										className={cn(
											"flex items-center justify-center px-2 py-4 transition-colors",
											isActive
												? "text-primary"
												: "text-muted-foreground hover:text-foreground"
										)}
										aria-label={item.label}
									>
										<item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
} 