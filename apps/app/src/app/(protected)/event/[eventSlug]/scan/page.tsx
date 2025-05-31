"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { QRResultHandler } from "~/components/qr-result-handler";
import { QRScanner } from "~/components/qr-scanner";

export default function ScanPage() {
	const router = useRouter();
	const params = useParams();
	const eventSlug = params.eventSlug as string;

	const [scanResult, setScanResult] = useState<string | null>(null);

	const handleScan = (data: string) => {
		setScanResult(data);
	};

	const handleClose = () => {
		router.back();
	};

	const handleSuccess = () => {
		// Go back to the previous page after successful action
		router.back();
	};

	const handleNewScan = () => {
		setScanResult(null);
	};

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="container mx-auto max-w-lg">
				{scanResult ? (
					<QRResultHandler
						qrData={scanResult}
						onClose={handleClose}
						onSuccess={handleSuccess}
					/>
				) : (
					<QRScanner
						onScan={handleScan}
						onClose={handleClose}
						title="Scan QR Code"
						description="Scan a QR code to complete tasks, make payments, or check in"
					/>
				)}
			</div>
		</div>
	);
}
