import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	create: publicProcedure
		.input(
			z.object({
				walletAddress: z.string().min(1),
				username: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(users).values({
				walletAddress: input.walletAddress,
				username: input.username,
			});
		}),

	getLatest: publicProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.query.users.findFirst({
			orderBy: (users, { desc }) => [desc(users.createdAt)],
		});

		return post ?? null;
	}),
});
