"use client";

import { QrCode, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { WalletGuard } from "~/components/wallet-guard";
import { BottomNavigation } from "~/components/bottom-navigation";

export default function ScanPage() {
	return (
		<WalletGuard>
			<div className="min-h-screen pb-20">
				<div className="p-6">
					<h1 className="font-bold text-2xl mb-2">Scan QR Code</h1>
					<p className="text-muted-foreground mb-6">
						Scan event codes to check in, earn rewards, or make payments
					</p>

					<Card className="mb-6">
						<CardContent className="flex items-center justify-center p-0">
							<div className="aspect-square w-full max-w-sm bg-muted rounded-lg flex items-center justify-center">
								<Camera className="h-16 w-16 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>

					<div className="space-y-4">
						<Button className="w-full" size="lg">
							<Camera className="mr-2 h-5 w-5" />
							Open Camera
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or enter code manually
								</span>
							</div>
						</div>

						<div className="space-y-2">
							<input
								type="text"
								placeholder="Enter code"
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							/>
							<Button variant="outline" className="w-full">
								Submit Code
							</Button>
						</div>
					</div>

					<Card className="mt-6">
						<CardHeader>
							<CardTitle className="text-base">Recent Scans</CardTitle>
							<CardDescription className="text-sm">
								Your scanning history
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center justify-between py-2 border-b last:border-0">
								<div>
									<p className="font-medium text-sm">Coffee Festival - Main Stage</p>
									<p className="text-xs text-muted-foreground">2 hours ago</p>
								</div>
								<span className="text-sm text-green-600">+50 USDC</span>
							</div>
							<div className="flex items-center justify-between py-2 border-b last:border-0">
								<div>
									<p className="font-medium text-sm">Partner Booth #12</p>
									<p className="text-xs text-muted-foreground">Yesterday</p>
								</div>
								<span className="text-sm text-green-600">+25 USDC</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<BottomNavigation />
		</WalletGuard>
	);
} 