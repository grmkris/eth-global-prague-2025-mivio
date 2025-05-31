"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { DesktopNav } from "~/components/desktop-nav";
import { MobileHeader } from "~/components/mobile-header";
import { MobileNav } from "~/components/mobile-nav";
import { useIsMobile } from "~/hooks/use-mobile";

export function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isMobile = useIsMobile();

	return (
		<div className="flex min-h-screen bg-background">
			{!isMobile && <DesktopNav />}
			<main className="flex flex-1 flex-col">
				{isMobile && <MobileHeader />}
				<div className="container mx-auto max-w-5xl flex-1 p-4 pb-32 md:p-8 md:pb-8">
					{children}
				</div>
				{isMobile && <MobileNav />}
			</main>
		</div>
	);
}
