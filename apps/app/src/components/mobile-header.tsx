"use client";

import { User } from "lucide-react";
import { ThemeSwitcher } from "~/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUser } from "~/components/user-provider";

export function MobileHeader() {
	const { user } = useUser();

	return (
		<div className="sticky top-0 z-50 border-b bg-card md:hidden">
			<div className="flex items-center justify-between p-4">
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
						<p className="font-light text-muted-foreground text-sm">
							Your Festival Hub
						</p>
					</div>
				</div>
				<ThemeSwitcher />
			</div>
		</div>
	);
}
