import { TRPCError } from "@trpc/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	events,
	eventWallets,
	products,
	purchases,
	transactions,
	users,
} from "~/server/db/schema";

export const productRouter = createTRPCRouter({
	// Get all products for an event
	getByEvent: publicProcedure
		.input(
			z.object({
				eventSlug: z.string(),
				category: z
					.enum(["all", "merch", "food", "experience", "ticket"])
					.optional(),
				search: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			// Get event
			const event = await ctx.db
				.select()
				.from(events)
				.where(eq(events.slug, input.eventSlug))
				.limit(1);

			if (!event[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Event not found",
				});
			}

			// Build query
			let conditions = and(
				eq(products.eventId, event[0].id),
				eq(products.isAvailable, true),
			);

			if (input.category && input.category !== "all") {
				conditions = and(conditions, eq(products.category, input.category));
			}

			// Get products
			const productList = await ctx.db
				.select({
					id: products.id,
					name: products.name,
					description: products.description,
					price: products.price,
					category: products.category,
					imageUrl: products.imageUrl,
					stock: products.stock,
					maxPerUser: products.maxPerUser,
					metadata: products.metadata,
					sold: sql<number>`count(distinct ${purchases.id})`,
				})
				.from(products)
				.leftJoin(
					purchases,
					and(
						eq(products.id, purchases.productId),
						eq(purchases.status, "completed"),
					),
				)
				.where(conditions)
				.groupBy(products.id)
				.orderBy(desc(products.createdAt));

			// Filter by search if provided
			if (input.search) {
				const searchLower = input.search.toLowerCase();
				return productList.filter(
					(product) =>
						product.name.toLowerCase().includes(searchLower) ||
						(product.description?.toLowerCase().includes(searchLower) ?? false),
				);
			}

			return productList;
		}),

	// Purchase a product
	purchase: publicProcedure
		.input(
			z.object({
				productId: z.number(),
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				quantity: z.number().min(1).default(1),
				metadata: z.record(z.unknown()).optional(), // For size, variant, etc.
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Get user
			const user = await ctx.db
				.select()
				.from(users)
				.where(eq(users.walletAddress, input.walletAddress.toLowerCase()))
				.limit(1);

			if (!user[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			// Get product
			const product = await ctx.db
				.select()
				.from(products)
				.where(eq(products.id, input.productId))
				.limit(1);

			if (!product[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Product not found",
				});
			}

			if (!product[0].isAvailable) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Product is not available",
				});
			}

			// Check stock
			if (product[0].stock !== null) {
				const soldCount = await ctx.db
					.select({ count: sql<number>`sum(${purchases.quantity})` })
					.from(purchases)
					.where(
						and(
							eq(purchases.productId, input.productId),
							eq(purchases.status, "completed"),
						),
					);

				const totalSold = soldCount[0]?.count || 0;
				if (totalSold + input.quantity > product[0].stock) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Insufficient stock",
					});
				}
			}

			// Check per-user limit
			if (product[0].maxPerUser !== null) {
				const userPurchases = await ctx.db
					.select({ count: sql<number>`sum(${purchases.quantity})` })
					.from(purchases)
					.where(
						and(
							eq(purchases.productId, input.productId),
							eq(purchases.userId, user[0].id),
							eq(purchases.status, "completed"),
						),
					);

				const userTotal = userPurchases[0]?.count || 0;
				if (userTotal + input.quantity > product[0].maxPerUser) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: `You can only purchase ${product[0].maxPerUser} of this item`,
					});
				}
			}

			// Get user's event wallet
			const wallet = await ctx.db
				.select()
				.from(eventWallets)
				.where(
					and(
						eq(eventWallets.eventId, product[0].eventId),
						eq(eventWallets.userId, user[0].id),
					),
				)
				.limit(1);

			if (!wallet[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Wallet not found. Please join the event first.",
				});
			}

			// Calculate total price
			const totalPrice = Number.parseFloat(product[0].price) * input.quantity;

			// Check sufficient balance
			const currentBalance = Number.parseFloat(wallet[0].balance);
			if (currentBalance < totalPrice) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Insufficient balance",
				});
			}

			// Update wallet balance
			const newBalance = currentBalance - totalPrice;
			const newTotalSpent =
				Number.parseFloat(wallet[0].totalSpent) + totalPrice;

			await ctx.db
				.update(eventWallets)
				.set({
					balance: newBalance.toFixed(2),
					totalSpent: newTotalSpent.toFixed(2),
					updatedAt: new Date(),
				})
				.where(eq(eventWallets.id, wallet[0].id));

			// Create purchase record with QR code
			const qrCode = `PURCHASE-${Date.now()}-${user[0].id}-${product[0].id}`;

			const purchase = await ctx.db
				.insert(purchases)
				.values({
					productId: input.productId,
					userId: user[0].id,
					eventWalletId: wallet[0].id,
					quantity: input.quantity,
					totalPrice: totalPrice.toFixed(2),
					status: "completed",
					qrCode,
					metadata: input.metadata ? JSON.stringify(input.metadata) : null,
				})
				.returning();

			// Create transaction record
			await ctx.db.insert(transactions).values({
				eventWalletId: wallet[0].id,
				type: "purchase",
				amount: totalPrice.toFixed(2),
				description: `Purchase: ${product[0].name} x${input.quantity}`,
				referenceId: purchase[0]?.id,
				referenceType: "purchase",
			});

			return {
				success: true,
				purchase: purchase[0],
				qrCode,
				newBalance: newBalance.toFixed(2),
			};
		}),

	// Get user's purchase history
	getUserPurchases: publicProcedure
		.input(
			z.object({
				eventSlug: z.string(),
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				status: z
					.enum(["all", "pending", "completed", "cancelled", "refunded"])
					.optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			// Get user
			const user = await ctx.db
				.select()
				.from(users)
				.where(eq(users.walletAddress, input.walletAddress.toLowerCase()))
				.limit(1);

			if (!user[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			// Get event
			const event = await ctx.db
				.select()
				.from(events)
				.where(eq(events.slug, input.eventSlug))
				.limit(1);

			if (!event[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Event not found",
				});
			}

			// Build query
			let conditions = and(
				eq(purchases.userId, user[0].id),
				eq(products.eventId, event[0].id),
			);

			if (input.status && input.status !== "all") {
				conditions = and(conditions, eq(purchases.status, input.status));
			}

			// Get purchases with product details
			return await ctx.db
				.select({
					id: purchases.id,
					quantity: purchases.quantity,
					totalPrice: purchases.totalPrice,
					status: purchases.status,
					qrCode: purchases.qrCode,
					redeemedAt: purchases.redeemedAt,
					metadata: purchases.metadata,
					createdAt: purchases.createdAt,
					product: {
						id: products.id,
						name: products.name,
						description: products.description,
						price: products.price,
						category: products.category,
						imageUrl: products.imageUrl,
					},
				})
				.from(purchases)
				.innerJoin(products, eq(purchases.productId, products.id))
				.where(conditions)
				.orderBy(desc(purchases.createdAt));
		}),
});
