"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to events page after component mounts
		const redirectTimer = setTimeout(() => {
			router.push("/events");
		}, 1000); // 1 second delay to show the content

		// Cleanup timeout on unmount
		return () => clearTimeout(redirectTimer);
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="space-y-4 p-8 text-center">
				<h1 className="font-bold text-4xl text-gray-800">Welcome to Mivio</h1>
				<p className="text-gray-600 text-lg">Redirecting you to events...</p>
				<div className="flex justify-center">
					<div className="h-12 w-12 animate-spin rounded-full border-purple-600 border-b-2" />
				</div>
			</div>
		</div>
	);
}
