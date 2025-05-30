import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // Create or update user when wallet connects
  createOrUpdate: publicProcedure
    .input(z.object({
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      username: z.string().optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.walletAddress, input.walletAddress.toLowerCase()))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0]) {
        // Update existing user if new data provided
        if (input.username || input.email) {
          await ctx.db
            .update(users)
            .set({
              username: input.username || existingUser[0].username,
              email: input.email || existingUser[0].email,
              updatedAt: new Date(),
            })
            .where(eq(users.id, existingUser[0].id));
        }
        return existingUser[0];
      }

      // Create new user
      const newUser = await ctx.db
        .insert(users)
        .values({
          walletAddress: input.walletAddress.toLowerCase(),
          username: input.username,
          email: input.email,
        })
        .returning();

      return newUser[0];
    }),

  // Get user profile - requires wallet address in input
  getProfile: publicProcedure
    .input(z.object({
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    }))
    .query(async ({ ctx, input }) => {
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

      return user[0];
    }),

  // Update user profile - requires wallet address for authentication
  updateProfile: publicProcedure
    .input(z.object({
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      username: z.string().min(3).max(50).optional(),
      displayName: z.string().max(100).optional(),
      bio: z.string().max(500).optional(),
      avatarUrl: z.string().url().optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { walletAddress, ...updateData } = input;
      
      const updated = await ctx.db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.walletAddress, walletAddress.toLowerCase()))
        .returning();

      if (!updated[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return updated[0];
    }),
}); 