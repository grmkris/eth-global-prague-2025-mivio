"use client";

import { Copy, QrCode } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

const testQRCodes = [
	{
		name: "Task Completion",
		description: "Complete task-1 at the main stage",
		data: JSON.stringify({
			type: "task",
			taskId: "task-1",
			eventSlug: "summer-music-fest-2025",
		}),
		type: "task",
	},
	{
		name: "Payment QR",
		description: "Pay for coffee and pastry (120 EC)",
		data: JSON.stringify({
			type: "payment",
			itemId: "prod-4",
			amount: 120,
			vendor: "Coffee Corner",
			eventSlug: "summer-music-fest-2025",
		}),
		type: "payment",
	},
	{
		name: "Check-in QR",
		description: "Check in at Partner Booth #42",
		data: JSON.stringify({
			type: "checkin",
			locationId: "booth-42",
			points: 25,
			eventSlug: "summer-music-fest-2025",
		}),
		type: "checkin",
	},
	{
		name: "Simple Task Format",
		description: "Alternative task format",
		data: "task:task-2",
		type: "task",
	},
	{
		name: "Simple Payment Format",
		description: "Alternative payment format",
		data: "pay:lunch-combo:200",
		type: "payment",
	},
];

export function QRTestCodes() {
	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			// You might want to show a toast here
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h2 className="mb-2 font-semibold text-lg">Test QR Codes</h2>
				<p className="text-muted-foreground text-sm">
					Use these sample codes to test the QR scanner functionality. Copy the
					data and paste it in the manual entry field.
				</p>
			</div>

			<div className="grid gap-3">
				{testQRCodes.map((code) => (
					<Card key={code.data} className="relative">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">{code.name}</CardTitle>
								<Badge
									variant={
										code.type === "task"
											? "default"
											: code.type === "payment"
												? "secondary"
												: "outline"
									}
								>
									{code.type.toUpperCase()}
								</Badge>
							</div>
							<CardDescription>{code.description}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="rounded bg-muted p-2">
								<code className="break-all text-xs">{code.data}</code>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => copyToClipboard(code.data)}
								className="w-full"
							>
								<Copy className="mr-2 h-3 w-3" />
								Copy to Clipboard
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
