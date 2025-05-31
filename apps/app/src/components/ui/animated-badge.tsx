import type { VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { Badge, type badgeVariants } from "./badge";

interface AnimatedBadgeProps
	extends React.ComponentProps<"span">,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
}

export function AnimatedBadge({ className, ...props }: AnimatedBadgeProps) {
	return (
		<Badge
			{...props}
			className={cn(
				"fade-in-50 slide-in-from-top-1 animate-in duration-300",
				className,
			)}
		/>
	);
}
