"use client";

import { QrCode, Search, ShoppingBag, Tag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { PaymentModal } from "~/components/payment-modal";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	category: "merch" | "food" | "experience";
	image: string;
	available: boolean;
};

export function ShopDashboard() {
	const router = useRouter();
	const params = useParams();
	const eventSlug = params.eventSlug as string;

	const [searchQuery, setSearchQuery] = useState("");
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const products: Product[] = [
		{
			id: "prod-1",
			name: "Event T-Shirt",
			description: "Official event t-shirt with exclusive design",
			price: 250,
			category: "merch",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
		},
		{
			id: "prod-2",
			name: "Coffee Mug",
			description: "Ceramic mug with event logo",
			price: 150,
			category: "merch",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
		},
		{
			id: "prod-3",
			name: "Lunch Combo",
			description: "Sandwich, chips, and a drink",
			price: 200,
			category: "food",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
		},
		{
			id: "prod-4",
			name: "Coffee & Pastry",
			description: "Freshly brewed coffee with a pastry",
			price: 120,
			category: "food",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
		},
		{
			id: "prod-5",
			name: "VIP Lounge Access",
			description: "1-hour access to the VIP lounge with free drinks",
			price: 500,
			category: "experience",
			image: "/placeholder.svg?height=200&width=200",
			available: true,
		},
		{
			id: "prod-6",
			name: "Speaker Meet & Greet",
			description: "Exclusive 15-minute session with a keynote speaker",
			price: 750,
			category: "experience",
			image: "/placeholder.svg?height=200&width=200",
			available: false,
		},
	];

	const handleBuy = (product: Product) => {
		setSelectedProduct(product);
		setShowPaymentModal(true);
	};

	const handleQuickScan = () => {
		router.push(`/event/${eventSlug}/scan`);
	};

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const merchProducts = filteredProducts.filter((p) => p.category === "merch");
	const foodProducts = filteredProducts.filter((p) => p.category === "food");
	const experienceProducts = filteredProducts.filter(
		(p) => p.category === "experience",
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Shop</h1>
					<p className="text-muted-foreground">
						Browse and purchase items with your EventCoins
					</p>
				</div>
				<Button onClick={handleQuickScan} size="sm" variant="outline">
					<QrCode className="mr-2 h-4 w-4" />
					Scan to Pay
				</Button>
			</div>

			<div className="relative">
				<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search products..."
					className="pl-9"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<Tabs defaultValue="all" className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="merch">Merch</TabsTrigger>
					<TabsTrigger value="food">Food</TabsTrigger>
					<TabsTrigger value="experiences">Experiences</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-4">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filteredProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onBuy={handleBuy}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="merch" className="mt-4">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{merchProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onBuy={handleBuy}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="food" className="mt-4">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{foodProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onBuy={handleBuy}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="experiences" className="mt-4">
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{experienceProducts.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onBuy={handleBuy}
							/>
						))}
					</div>
				</TabsContent>
			</Tabs>

			{showPaymentModal && selectedProduct && (
				<PaymentModal
					open={showPaymentModal}
					onClose={() => setShowPaymentModal(false)}
					balance="1,250"
					onPayment={(amount) => {
						// Handle payment
						setShowPaymentModal(false);
					}}
				/>
			)}
		</div>
	);
}

function ProductCard({
	product,
	onBuy,
}: {
	product: Product;
	onBuy: (product: Product) => void;
}) {
	return (
		<Card className="overflow-hidden">
			<div className="relative aspect-square">
				<img
					src={product.image || "/placeholder.svg"}
					alt={product.name}
					className="h-full w-full object-cover"
				/>
				<Badge
					className="absolute top-2 right-2"
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
			<CardHeader className="pb-2">
				<CardTitle>{product.name}</CardTitle>
				<CardDescription>{product.description}</CardDescription>
			</CardHeader>
			<CardContent className="pb-2">
				<div className="flex items-center gap-1">
					<Tag className="h-4 w-4 text-muted-foreground" />
					<span className="font-bold">{product.price} EC</span>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					onClick={() => onBuy(product)}
					disabled={!product.available}
				>
					{product.available ? (
						<>
							<ShoppingBag className="mr-2 h-4 w-4" />
							Buy Now
						</>
					) : (
						"Sold Out"
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}
