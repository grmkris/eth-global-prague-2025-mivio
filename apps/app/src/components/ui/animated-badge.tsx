import { cn } from "~/lib/utils";
import { Badge, type badgeVariants } from "./badge";
import type { VariantProps } from "class-variance-authority";

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
				"animate-in fade-in-50 slide-in-from-top-1 duration-300",
				className,
			)}
		/>
	);
} 