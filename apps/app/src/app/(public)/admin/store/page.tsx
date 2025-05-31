"use client";

import {
	ArrowLeft,
	DollarSign,
	Edit,
	Eye,
	Plus,
	QrCode,
	ShoppingBag,
	Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { QRCodeGenerator } from "~/components/qr-code-generator";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	category: "merch" | "food" | "experience";
	image: string;
	available: boolean;
	soldCount: number;
	vendor: string;
};

export default function AdminStorePage() {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [showQRModal, setShowQRModal] = useState(false);

	const products: Product[] = [
		{
			id: "prod-1",
			name: "Festival T-Shirt",
			description: "Official festival t-shirt with exclusive lineup design",
			price: 250,
			category: "merch",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
			soldCount: 870,
			vendor: "Festival Merchandise",
		},
		{
			id: "prod-2",
			name: "Artist Poster Set",
			description: "Limited edition poster set featuring main stage artists",
			price: 150,
			category: "merch",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
			soldCount: 230,
			vendor: "Festival Merchandise",
		},
		{
			id: "prod-3",
			name: "Gourmet Food Combo",
			description: "Artisan sandwich, chips, and craft beverage",
			price: 200,
			category: "food",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
			soldCount: 1560,
			vendor: "Artisan Food Truck",
		},
		{
			id: "prod-4",
			name: "Craft Coffee & Pastry",
			description: "Locally roasted coffee with fresh baked pastry",
			price: 120,
			category: "food",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
			soldCount: 890,
			vendor: "Bean There Coffee",
		},
		{
			id: "prod-5",
			name: "VIP Lounge Access",
			description: "2-hour access to the VIP lounge with complimentary drinks",
			price: 500,
			category: "experience",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
			soldCount: 120,
			vendor: "VIP Services",
		},
		{
			id: "prod-6",
			name: "Artist Meet & Greet",
			description: "Exclusive 15-minute session with a headlining artist",
			price: 750,
			category: "experience",
			image: "/placeholder.svg?height=200&width=200",
			available: false,
			soldCount: 30,
			vendor: "Premium Experiences",
		},
	];

	const generatePaymentQR = (product: Product) => {
		setSelectedProduct(product);
		setShowQRModal(true);
	};

	const getQRData = (product: Product) => {
		return JSON.stringify({
			type: "payment",
			itemId: product.id,
			amount: product.price,
			vendor: product.vendor,
			eventSlug: "summer-music-fest-2025",
			description: product.name,
		});
	};

	const totalRevenue = products.reduce(
		(sum, p) => sum + p.price * p.soldCount,
		0,
	);
	const totalSold = products.reduce((sum, p) => sum + p.soldCount, 0);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="mb-4 flex items-center gap-4">
						<Link href="/admin">
							<Button variant="ghost" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Merchant Store
							</h1>
							<p className="text-muted-foreground">
								Manage store items and generate payment QR codes
							</p>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<div className="text-center">
								<p className="font-bold text-2xl">
									{products.filter((p) => p.available).length}
								</p>
								<p className="text-muted-foreground text-sm">Available Items</p>
							</div>
							<div className="text-center">
								<p className="font-bold text-2xl">{totalSold}</p>
								<p className="text-muted-foreground text-sm">Items Sold</p>
							</div>
							<div className="text-center">
								<p className="font-bold text-2xl">
									{totalRevenue.toLocaleString()} EC
								</p>
								<p className="text-muted-foreground text-sm">Total Revenue</p>
							</div>
						</div>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add New Product
						</Button>
					</div>
				</div>

				{/* Products Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{products.map((product) => (
						<Card key={product.id} className="relative overflow-hidden">
							{/* Product Image */}
							<div className="relative aspect-video bg-muted">
								<img
									src={product.image}
									alt={product.name}
									className="h-full w-full object-cover"
								/>
								<div className="absolute top-2 left-2">
									<Badge variant={product.available ? "default" : "secondary"}>
										{product.available ? "Available" : "Sold Out"}
									</Badge>
								</div>
								<div className="absolute top-2 right-2">
									<Badge
										variant={
											product.category === "merch"
												? "default"
												: product.category === "food"
													? "secondary"
													: "outline"
										}
									>
										{product.category === "merch"
											? "Merchandise"
											: product.category === "food"
												? "Food & Drink"
												: "Experience"}
									</Badge>
								</div>
							</div>

							<CardHeader className="pb-3">
								<CardTitle className="text-lg">{product.name}</CardTitle>
								<CardDescription>{product.description}</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* Product Details */}
								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Price:</span>
										<div className="flex items-center gap-1">
											<Tag className="h-3 w-3" />
											<span className="font-bold">{product.price} EC</span>
										</div>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Vendor:</span>
										<span className="font-medium">{product.vendor}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Sold:</span>
										<span className="font-medium">
											{product.soldCount} units
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground">Revenue:</span>
										<div className="flex items-center gap-1">
											<DollarSign className="h-3 w-3" />
											<span className="font-bold">
												{(product.price * product.soldCount).toLocaleString()}{" "}
												EC
											</span>
										</div>
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => generatePaymentQR(product)}
										className="flex-1"
										disabled={!product.available}
									>
										<QrCode className="mr-2 h-3 w-3" />
										Payment QR
									</Button>
									<Button variant="ghost" size="sm">
										<Edit className="h-3 w-3" />
									</Button>
									<Button variant="ghost" size="sm">
										<Eye className="h-3 w-3" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* QR Code Modal */}
				{selectedProduct && (
					<QRCodeGenerator
						data={getQRData(selectedProduct)}
						title={`Payment: ${selectedProduct.name}`}
						description={`${selectedProduct.price} EC - ${selectedProduct.vendor}`}
						open={showQRModal}
						onClose={() => setShowQRModal(false)}
					/>
				)}
			</div>
		</div>
	);
}
