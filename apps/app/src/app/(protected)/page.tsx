"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
			<div className="text-center space-y-4 p-8">
				<h1 className="text-4xl font-bold text-gray-800">Welcome to Mivio</h1>
				<p className="text-lg text-gray-600">Redirecting you to events...</p>
				<div className="flex justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
				</div>
			</div>
		</div>
	);
}
