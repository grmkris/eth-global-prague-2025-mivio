"use client";

import { Home } from "lucide-react";
import { ThemeSwitcher } from "~/components/theme-switcher";

export function MobileHeader() {
	return (
		<div className="sticky top-0 z-50 border-b bg-card md:hidden">
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
						<Home className="h-4 w-4 text-primary-foreground" />
					</div>
					<h1 className="font-bold text-xl">Mivio</h1>
				</div>
				<ThemeSwitcher />
			</div>
		</div>
	);
}
