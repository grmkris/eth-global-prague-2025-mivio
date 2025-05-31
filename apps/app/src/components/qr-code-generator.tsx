"use client";

import { Copy, Download, QrCode } from "lucide-react";
import { useRef, useState } from "react";
import QRCodeSVG from "react-qr-code";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";

interface QRCodeGeneratorProps {
	data: string;
	title: string;
	description?: string;
	open: boolean;
	onClose: () => void;
}

export function QRCodeGenerator({
	data,
	title,
	description,
	open,
	onClose,
}: QRCodeGeneratorProps) {
	const qrRef = useRef<HTMLDivElement>(null);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(data);
			// Could show a toast here
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const downloadQRCode = () => {
		// Create an SVG element from the QR code
		const svg = qrRef.current?.querySelector("svg");
		if (!svg) return;

		// Convert SVG to PNG for download
		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		canvas.width = 200;
		canvas.height = 200;

		img.onload = () => {
			if (ctx) {
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);

				const link = document.createElement("a");
				link.download = `qr-code-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
				link.href = canvas.toDataURL("image/png");
				link.click();
			}
		};

		img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<QrCode className="h-5 w-5" />
						{title}
					</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				<div className="space-y-4">
					{/* QR Code Display */}
					<div className="flex justify-center">
						<div
							ref={qrRef}
							className="rounded-lg border-2 border-muted-foreground/20 border-dashed bg-white p-4"
						>
							<QRCodeSVG
								value={data}
								size={200}
								level="M"
								bgColor="#FFFFFF"
								fgColor="#000000"
							/>
						</div>
					</div>

					{/* QR Data */}
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">QR Code Data</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="rounded bg-muted p-3">
								<code className="break-all text-xs">{data}</code>
							</div>
						</CardContent>
					</Card>

					{/* Actions */}
					<div className="grid grid-cols-2 gap-2">
						<Button variant="outline" onClick={copyToClipboard}>
							<Copy className="mr-2 h-4 w-4" />
							Copy Data
						</Button>
						<Button variant="outline" onClick={downloadQRCode}>
							<Download className="mr-2 h-4 w-4" />
							Download PNG
						</Button>
					</div>

					{/* Instructions */}
					<div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950">
						<p className="text-blue-800 text-sm dark:text-blue-200">
							Users can scan this QR code with their mobile devices or use the
							"Manual Entry" option in the scanner
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
