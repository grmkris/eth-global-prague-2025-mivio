"use client";

import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Camera, CameraOff, X } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface QRScannerProps {
	onScan: (data: string) => void;
	onClose: () => void;
	title?: string;
	description?: string;
}

export function QRScanner({
	onScan,
	onClose,
	title = "Scan QR Code",
	description = "Point your camera at a QR code to scan",
}: QRScannerProps) {
	const [error, setError] = useState<string | null>(null);
	const [manualEntry, setManualEntry] = useState(false);
	const [manualCode, setManualCode] = useState("");
	const [isScanning, setIsScanning] = useState(true);

	const handleScan = (detectedCodes: IDetectedBarcode[]) => {
		if (detectedCodes && detectedCodes.length > 0) {
			const result = detectedCodes[0]?.rawValue;
			if (!result) {
				console.error("No QR code detected");
				setError("No QR code detected");
				setIsScanning(false);
				return;
			}
			console.log("QR Code scanned:", result);
			setIsScanning(false);
			onScan(result);
		}
	};

	const handleError = (error: unknown) => {
		console.error("QR Scanner error:", error);
		setError(
			"Unable to access camera. Please ensure camera permissions are granted.",
		);
		setIsScanning(false);
	};

	const handleManualSubmit = () => {
		if (manualCode.trim()) {
			onScan(manualCode.trim());
		}
	};

	const retryScanning = () => {
		setError(null);
		setIsScanning(true);
	};

	if (manualEntry) {
		return (
			<Card className="mx-auto w-full max-w-md">
				<CardHeader>
					<CardTitle>Enter QR Code</CardTitle>
					<CardDescription>
						Manually enter the QR code data if camera scanning isn't working
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="manual-code">QR Code Data</Label>
						<Input
							id="manual-code"
							value={manualCode}
							onChange={(e) => setManualCode(e.target.value)}
							placeholder="Paste or type QR code content"
						/>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setManualEntry(false)}
							className="flex-1"
						>
							Back to Camera
						</Button>
						<Button
							onClick={handleManualSubmit}
							disabled={!manualCode.trim()}
							className="flex-1"
						>
							Submit
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="relative mx-auto w-full max-w-md">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{title}</CardTitle>
							<CardDescription>{description}</CardDescription>
						</div>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{error ? (
						<div className="space-y-4 p-6 text-center">
							<CameraOff className="mx-auto h-12 w-12 text-muted-foreground" />
							<p className="text-muted-foreground text-sm">{error}</p>
							<div className="space-y-2">
								<Button onClick={retryScanning} className="w-full">
									<Camera className="mr-2 h-4 w-4" />
									Try Again
								</Button>
								<Button
									variant="outline"
									onClick={() => setManualEntry(true)}
									className="w-full"
								>
									Enter Manually
								</Button>
							</div>
						</div>
					) : (
						<div className="relative">
							<div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-b-lg">
								{isScanning && (
									<Scanner
										onScan={handleScan}
										onError={handleError}
										constraints={{
											facingMode: "environment",
										}}
										styles={{
											container: {
												width: "100%",
												height: "100%",
											},
											video: {
												width: "100%",
												height: "100%",
												objectFit: "cover",
											},
										}}
									/>
								)}
							</div>

							{/* Scanning overlay */}
							{isScanning && (
								<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
									<div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-primary border-dashed">
										<div className="text-center text-primary">
											<div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
											<p className="font-medium text-sm">Scanning...</p>
										</div>
									</div>
								</div>
							)}

							{/* Controls */}
							<div className="absolute right-4 bottom-4 left-4 flex justify-center">
								<Button
									variant="secondary"
									onClick={() => setManualEntry(true)}
									className="bg-black/50 text-white hover:bg-black/70"
								>
									Manual Entry
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
