import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	events,
	eventWallets,
	rewards,
	taskCompletions,
	tasks,
	transactions,
	userRewards,
	users,
} from "~/server/db/schema";

export const taskRouter = createTRPCRouter({
	// Get all tasks for an event
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

			// Get all active tasks for the event
			return await ctx.db
				.select({
					id: tasks.id,
					title: tasks.title,
					description: tasks.description,
					reward: tasks.reward,
					rewardType: tasks.rewardType,
					maxCompletions: tasks.maxCompletions,
					requiresVerification: tasks.requiresVerification,
					metadata: tasks.metadata,
					isActive: tasks.isActive,
					completions: sql<number>`count(distinct ${taskCompletions.userId})`,
				})
				.from(tasks)
				.leftJoin(
					taskCompletions,
					and(
						eq(tasks.id, taskCompletions.taskId),
						eq(taskCompletions.status, "completed"),
					),
				)
				.where(and(eq(tasks.eventId, event[0].id), eq(tasks.isActive, true)))
				.groupBy(tasks.id)
				.orderBy(desc(tasks.createdAt));
		}),

	// Get user's task completions for an event
	getUserCompletions: publicProcedure
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

			// Get tasks with user completion status
			return await ctx.db
				.select({
					taskId: tasks.id,
					title: tasks.title,
					description: tasks.description,
					reward: tasks.reward,
					rewardType: tasks.rewardType,
					requiresVerification: tasks.requiresVerification,
					metadata: tasks.metadata,
					completionId: taskCompletions.id,
					status: taskCompletions.status,
					completedAt: taskCompletions.completedAt,
					proofUrl: taskCompletions.proofUrl,
				})
				.from(tasks)
				.leftJoin(
					taskCompletions,
					and(
						eq(tasks.id, taskCompletions.taskId),
						eq(taskCompletions.userId, user[0].id),
					),
				)
				.where(and(eq(tasks.eventId, event[0].id), eq(tasks.isActive, true)))
				.orderBy(desc(tasks.createdAt));
		}),

	// Complete a task
	complete: publicProcedure
		.input(
			z.object({
				taskId: z.number(),
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				proofUrl: z.string().url().optional(),
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

			// Get task
			const task = await ctx.db
				.select()
				.from(tasks)
				.where(eq(tasks.id, input.taskId))
				.limit(1);

			if (!task[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Task not found",
				});
			}

			// Check if already completed
			const existingCompletion = await ctx.db
				.select()
				.from(taskCompletions)
				.where(
					and(
						eq(taskCompletions.taskId, input.taskId),
						eq(taskCompletions.userId, user[0].id),
					),
				)
				.limit(1);

			if (
				existingCompletion[0] &&
				existingCompletion[0].status === "completed"
			) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Task already completed",
				});
			}

			// Check max completions limit
			if (task[0].maxCompletions) {
				const completionCount = await ctx.db
					.select({ count: sql<number>`count(*)` })
					.from(taskCompletions)
					.where(
						and(
							eq(taskCompletions.taskId, input.taskId),
							eq(taskCompletions.status, "completed"),
						),
					);

				if (
					completionCount[0] &&
					completionCount[0].count >= task[0].maxCompletions
				) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Task has reached maximum completions",
					});
				}
			}

			// Create or update task completion
			const status = task[0].requiresVerification ? "pending" : "completed";
			const completedAt = status === "completed" ? new Date() : null;

			if (existingCompletion[0]) {
				await ctx.db
					.update(taskCompletions)
					.set({
						status,
						proofUrl: input.proofUrl,
						completedAt,
					})
					.where(eq(taskCompletions.id, existingCompletion[0].id));
			} else {
				await ctx.db.insert(taskCompletions).values({
					taskId: input.taskId,
					userId: user[0].id,
					status,
					proofUrl: input.proofUrl,
					completedAt,
				});
			}

			// If completed immediately (no verification required), process rewards
			if (status === "completed" && task[0].rewardType === "token") {
				// Get user's event wallet
				const wallet = await ctx.db
					.select()
					.from(eventWallets)
					.where(
						and(
							eq(eventWallets.eventId, task[0].eventId),
							eq(eventWallets.userId, user[0].id),
						),
					)
					.limit(1);

				if (wallet[0]) {
					// Update wallet balance
					const newBalance =
						Number.parseFloat(wallet[0].balance) +
						Number.parseFloat(task[0].reward);
					const newTotalEarned =
						Number.parseFloat(wallet[0].totalEarned) +
						Number.parseFloat(task[0].reward);

					await ctx.db
						.update(eventWallets)
						.set({
							balance: newBalance.toFixed(2),
							totalEarned: newTotalEarned.toFixed(2),
							updatedAt: new Date(),
						})
						.where(eq(eventWallets.id, wallet[0].id));

					// Create transaction record
					await ctx.db.insert(transactions).values({
						eventWalletId: wallet[0].id,
						type: "reward",
						amount: task[0].reward,
						description: `Task reward: ${task[0].title}`,
						referenceId: task[0].id,
						referenceType: "task",
					});
				}
			} else if (status === "completed" && task[0].rewardType === "badge") {
				// Handle badge rewards - create reward if not exists
				const existingReward = await ctx.db
					.select()
					.from(rewards)
					.where(
						and(
							eq(rewards.eventId, task[0].eventId),
							eq(rewards.name, task[0].title),
						),
					)
					.limit(1);

				let rewardId: number;
				if (existingReward[0]) {
					rewardId = existingReward[0].id;
				} else {
					const newReward = await ctx.db
						.insert(rewards)
						.values({
							eventId: task[0].eventId,
							name: task[0].title,
							description: task[0].description || "",
							type: "badge",
						})
						.returning();

					if (!newReward[0]) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: "Failed to create reward",
						});
					}

					rewardId = newReward[0].id;
				}

				// Grant badge to user
				await ctx.db.insert(userRewards).values({
					userId: user[0].id,
					rewardId,
					eventId: task[0].eventId,
				});
			}

			return {
				success: true,
				status,
				message:
					status === "completed"
						? "Task completed successfully!"
						: "Task submitted for verification",
			};
		}),

	// Submit proof for task verification
	submitProof: publicProcedure
		.input(
			z.object({
				completionId: z.number(),
				walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
				proofUrl: z.string().url(),
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

			// Get task completion
			const completion = await ctx.db
				.select()
				.from(taskCompletions)
				.where(
					and(
						eq(taskCompletions.id, input.completionId),
						eq(taskCompletions.userId, user[0].id),
					),
				)
				.limit(1);

			if (!completion[0]) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Task completion not found",
				});
			}

			if (completion[0].status === "completed") {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Task already completed",
				});
			}

			// Update proof URL
			await ctx.db
				.update(taskCompletions)
				.set({
					proofUrl: input.proofUrl,
					status: "in_progress",
				})
				.where(eq(taskCompletions.id, input.completionId));

			return {
				success: true,
				message: "Proof submitted successfully",
			};
		}),
});
