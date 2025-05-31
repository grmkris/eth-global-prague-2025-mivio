import { AppLayout } from "~/components/app-layout";
import { AuthGuard } from "~/components/auth-guard";
import { UserProvider } from "~/components/user-provider";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthGuard>
			<UserProvider>
				<AppLayout>{children}</AppLayout>
			</UserProvider>
		</AuthGuard>
	);
}
