import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	events,
	eventParticipants,
	eventWallets,
	taskCompletions,
	tasks,
	users,
} from "~/server/db/schema";

export const eventRouter = createTRPCRouter({
	// Get all public events
	getAll: publicProcedure
		.input(
			z.object({
				status: z
					.enum(["all", "upcoming", "active", "completed"])
					.optional()
					.default("all"),
			}),
		)
		.query(async ({ ctx, input }) => {
			const baseQuery = ctx.db
				.select({
					id: events.id,
					slug: events.slug,
					name: events.name,
					description: events.description,
					location: events.location,
					startDate: events.startDate,
					endDate: events.endDate,
					bannerImage: events.bannerImage,
					status: events.status,
					attendees: sql<number>`count(distinct ${eventParticipants.userId})`,
				})
				.from(events)
				.leftJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
				.groupBy(events.id)
				.orderBy(desc(events.startDate));

			if (input.status !== "all") {
				return await baseQuery.where(eq(events.status, input.status));
			}

			return await baseQuery;
		}),

	// Get event by slug
	getBySlug: publicProcedure
		.input(
			z.object({
				slug: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const event = await ctx.db
				.select({
					id: events.id,
					slug: events.slug,
					name: events.name,
					description: events.description,
					location: events.location,
					startDate: events.startDate,
					endDate: events.endDate,
					bannerImage: events.bannerImage,
					status: events.status,
					maxAttendees: events.maxAttendees,
					virtualUrl: events.virtualUrl,
					metadata: events.metadata,
					attendees: sql<number>`count(distinct ${eventParticipants.userId})`,
				})
				.from(events)
				.leftJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
				.where(eq(events.slug, input.slug))
				.groupBy(events.id)
				.limit(1);

			if (!event[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Event not found",
				});
			}

			return event[0];
		}),

	// Get user's joined events
	getUserEvents: publicProcedure
		.input(
			z.object({
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
			}),
		)
		.query(async ({ ctx, input }) => {
			// First get user
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

			return await ctx.db
				.select({
					id: events.id,
					slug: events.slug,
					name: events.name,
					description: events.description,
					location: events.location,
					startDate: events.startDate,
					endDate: events.endDate,
					bannerImage: events.bannerImage,
					status: events.status,
					joinedAt: eventParticipants.joinedAt,
					role: eventParticipants.role,
				})
				.from(events)
				.innerJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
				.where(eq(eventParticipants.userId, user[0].id))
				.orderBy(desc(eventParticipants.joinedAt));
		}),

	// Join an event
	join: publicProcedure
		.input(
			z.object({
				eventSlug: z.string(),
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
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

			// Check if already joined
			const existing = await ctx.db
				.select()
				.from(eventParticipants)
				.where(
					and(
						eq(eventParticipants.eventId, event[0].id),
						eq(eventParticipants.userId, user[0].id),
					),
				)
				.limit(1);

			if (existing[0]) {
				// Get the existing wallet
				const existingWallet = await ctx.db
					.select()
					.from(eventWallets)
					.where(
						and(
							eq(eventWallets.eventId, event[0].id),
							eq(eventWallets.userId, user[0].id),
						),
					)
					.limit(1);

				return {
					success: true,
					message: "Already joined this event",
					eventWalletId: existingWallet[0]?.id,
					needsChannel: true,
					eventId: event[0].id,
					userId: user[0].id,
				};
			}

			// Join event
			await ctx.db.insert(eventParticipants).values({
				eventId: event[0].id,
				userId: user[0].id,
			});

			// Create event wallet
			const wallet = await ctx.db
				.insert(eventWallets)
				.values({
					eventId: event[0].id,
					userId: user[0].id,
					balance: "0.00",
					totalEarned: "0.00",
					totalSpent: "0.00",
				})
				.returning();

			return {
				success: true,
				message: "Successfully joined event",
				eventWalletId: wallet[0]?.id,
				needsChannel: true,
				eventId: event[0].id,
				userId: user[0].id,
			};
		}),

	// Get participant stats for event dashboard
	getParticipantStats: publicProcedure
		.input(
			z.object({
				eventSlug: z.string(),
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
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

			// Get wallet balance
			const wallet = await ctx.db
				.select()
				.from(eventWallets)
				.where(
					and(
						eq(eventWallets.eventId, event[0].id),
						eq(eventWallets.userId, user[0].id),
					),
				)
				.limit(1);

			// Get task completion stats
			const taskStats = await ctx.db
				.select({
					totalTasks: sql<number>`count(distinct ${tasks.id})`,
					completedTasks: sql<number>`count(distinct case when ${taskCompletions.status} = 'completed' then ${taskCompletions.taskId} end)`,
				})
				.from(tasks)
				.leftJoin(
					taskCompletions,
					and(
						eq(tasks.id, taskCompletions.taskId),
						eq(taskCompletions.userId, user[0].id),
					),
				)
				.where(eq(tasks.eventId, event[0].id))
				.limit(1);

			return {
				balance: wallet[0]?.balance || "0.00",
				totalEarned: wallet[0]?.totalEarned || "0.00",
				totalSpent: wallet[0]?.totalSpent || "0.00",
				tasksCompleted: taskStats[0]?.completedTasks || 0,
				totalTasks: taskStats[0]?.totalTasks || 0,
				level: Math.floor((taskStats[0]?.completedTasks || 0) / 3) + 1, // Simple level calculation
			};
		}),
});
