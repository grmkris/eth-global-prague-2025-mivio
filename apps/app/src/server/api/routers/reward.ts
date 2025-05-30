import { TRPCError } from "@trpc/server";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	events,
	eventParticipants,
	eventWallets,
	rewards,
	taskCompletions,
	tasks,
	userRewards,
	users,
} from "~/server/db/schema";

export const rewardRouter = createTRPCRouter({
	// Get all rewards for an event
	getByEvent: publicProcedure
		.input(
			z.object({
				eventSlug: z.string(),
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

			// Get all active rewards for the event
			return await ctx.db
				.select()
				.from(rewards)
				.where(
					and(eq(rewards.eventId, event[0].id), eq(rewards.isActive, true)),
				)
				.orderBy(desc(rewards.createdAt));
		}),

	// Get user's earned rewards
	getUserRewards: publicProcedure
		.input(
			z.object({
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				eventSlug: z.string().optional(),
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

			// Build query
			let conditions = eq(userRewards.userId, user[0].id);

			if (input.eventSlug) {
				const event = await ctx.db
					.select()
					.from(events)
					.where(eq(events.slug, input.eventSlug))
					.limit(1);

				if (event[0]) {
					conditions = conditions.append(eq(userRewards.eventId, event[0].id));
				}
			}

			// Get user rewards with reward details
			return await ctx.db
				.select({
					id: userRewards.id,
					earnedAt: userRewards.earnedAt,
					expiresAt: userRewards.expiresAt,
					reward: {
						id: rewards.id,
						name: rewards.name,
						description: rewards.description,
						type: rewards.type,
						imageUrl: rewards.imageUrl,
						value: rewards.value,
					},
				})
				.from(userRewards)
				.innerJoin(rewards, eq(userRewards.rewardId, rewards.id))
				.where(conditions)
				.orderBy(desc(userRewards.earnedAt));
		}),

	// Get user's achievements with progress
	getUserAchievements: publicProcedure
		.input(
			z.object({
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				eventSlug: z.string(),
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

			if (!event[0]?.id) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Event not found",
				});
			}

			// Define achievements - in a real app, these would be in a database table
			const achievements = [
				{
					id: "early-bird",
					title: "Early Bird",
					description: "Arrived at the event within the first hour",
					type: "milestone",
					criteria: { type: "checkin", timeLimit: 3600 }, // seconds
				},
				{
					id: "networking-pro",
					title: "Networking Pro",
					description: "Connected with 10+ attendees",
					type: "social",
					criteria: { type: "connections", count: 10 },
				},
				{
					id: "task-master",
					title: "Task Master",
					description: "Completed all available tasks",
					type: "completion",
					criteria: { type: "all_tasks" },
				},
				{
					id: "vip-status",
					title: "VIP Status",
					description: "Earned over 1,000 EventCoins",
					type: "wealth",
					criteria: { type: "balance", amount: 1000 },
				},
			];

			// Calculate progress for each achievement
			const achievementsWithProgress = await Promise.all(
				achievements.map(async (achievement) => {
					if (!event[0]?.id) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Event not found",
						});
					}

					if (!user[0]?.id) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "User not found",
						});
					}

					let earned = false;
					let progress = 0;

					switch (achievement.criteria.type) {
						case "checkin": {
							// Check if user checked in early
							const participation = await ctx.db
								.select()
								.from(eventParticipants)
								.where(
									and(
										eq(eventParticipants.eventId, event[0].id),
										eq(eventParticipants.userId, user[0].id),
									),
								)
								.limit(1);

							if (participation[0]?.checkedIn && participation[0].checkedInAt) {
								const eventStart = new Date(event[0].startDate);
								const checkinTime = new Date(participation[0].checkedInAt);
								const diffSeconds =
									(checkinTime.getTime() - eventStart.getTime()) / 1000;
								earned = diffSeconds <= (achievement.criteria.timeLimit ?? 0);
								progress = earned ? 100 : 0;
							}
							break;
						}

						case "all_tasks": {
							// Check task completion
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

							const total = taskStats[0]?.totalTasks || 0;
							const completed = taskStats[0]?.completedTasks || 0;
							earned = total > 0 && completed === total;
							progress = total > 0 ? Math.round((completed / total) * 100) : 0;
							break;
						}

						case "balance": {
							// Check wallet balance
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

							const totalEarned = Number.parseFloat(
								wallet[0]?.totalEarned || "0",
							);
							earned = totalEarned >= (achievement.criteria.amount ?? 0);
							progress = Math.min(
								100,
								Math.round(
									(totalEarned / (achievement.criteria.amount ?? 0)) * 100,
								),
							);
							break;
						}

						case "connections": {
							// This would require a connections table in a real app
							// For now, return mock progress
							progress = 40; // Mock: 4 out of 10 connections
							earned = false;
							break;
						}
					}

					// Check if user has earned this achievement
					const earnedReward = await ctx.db
						.select()
						.from(userRewards)
						.innerJoin(rewards, eq(userRewards.rewardId, rewards.id))
						.where(
							and(
								eq(userRewards.userId, user[0].id),
								eq(rewards.name, achievement.title),
								eq(userRewards.eventId, event[0].id),
							),
						)
						.limit(1);

					return {
						...achievement,
						earned: earned || !!earnedReward[0],
						progress,
					};
				}),
			);

			return achievementsWithProgress;
		}),

	// Grant a reward to a user (would be called by admin/system)
	grantReward: publicProcedure
		.input(
			z.object({
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				rewardId: z.number(),
				eventId: z.number().optional(),
				metadata: z.record(z.unknown()).optional(),
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

			// Get reward
			const reward = await ctx.db
				.select()
				.from(rewards)
				.where(eq(rewards.id, input.rewardId))
				.limit(1);

			if (!reward[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Reward not found",
				});
			}

			// Check if already granted
			const existing = await ctx.db
				.select()
				.from(userRewards)
				.where(
					and(
						eq(userRewards.userId, user[0].id),
						eq(userRewards.rewardId, input.rewardId),
						input.eventId
							? eq(userRewards.eventId, input.eventId)
							: isNull(userRewards.eventId),
					),
				)
				.limit(1);

			if (existing[0]) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Reward already granted",
				});
			}

			// Grant reward
			const userReward = await ctx.db
				.insert(userRewards)
				.values({
					userId: user[0].id,
					rewardId: input.rewardId,
					eventId: input.eventId,
					metadata: input.metadata ? JSON.stringify(input.metadata) : null,
				})
				.returning();

			return {
				success: true,
				userReward: userReward[0],
				reward: reward[0],
			};
		}),
});
