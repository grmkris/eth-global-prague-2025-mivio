import { AppLayout } from "~/components/app-layout";
import { AuthGuard } from "~/components/auth-guard";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthGuard>
			<AppLayout>{children}</AppLayout>
		</AuthGuard>
	);
}
