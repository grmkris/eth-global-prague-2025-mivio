import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eventWallets, users, events, transactions } from "~/server/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const walletRouter = createTRPCRouter({
  // Get event wallet for a user
  getEventWallet: publicProcedure
    .input(z.object({
      eventSlug: z.string(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    }))
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

      // Get wallet
      const wallet = await ctx.db
        .select()
        .from(eventWallets)
        .where(
          and(
            eq(eventWallets.eventId, event[0].id),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!wallet[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet not found. Please join the event first.",
        });
      }

      return wallet[0];
    }),

  // Get transaction history
  getTransactions: publicProcedure
    .input(z.object({
      eventSlug: z.string(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      type: z.enum(["all", "payment", "reward", "topup", "purchase", "refund"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Get user and event wallet
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

      const wallet = await ctx.db
        .select()
        .from(eventWallets)
        .where(
          and(
            eq(eventWallets.eventId, event[0].id),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!wallet[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet not found",
        });
      }

      // Get transactions with proper filtering
      const baseQuery = ctx.db
        .select()
        .from(transactions)
        .where(eq(transactions.eventWalletId, wallet[0].id))
        .orderBy(desc(transactions.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const transactionList = input.type && input.type !== "all" 
        ? await ctx.db
            .select()
            .from(transactions)
            .where(
              and(
                eq(transactions.eventWalletId, wallet[0].id),
                eq(transactions.type, input.type)
              )
            )
            .orderBy(desc(transactions.createdAt))
            .limit(input.limit)
            .offset(input.offset)
        : await baseQuery;

      // Get total count for pagination
      const countResult = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(eq(transactions.eventWalletId, wallet[0].id));

      return {
        transactions: transactionList,
        total: countResult[0]?.count || 0,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  // Top up wallet
  topUp: publicProcedure
    .input(z.object({
      eventSlug: z.string(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      amount: z.number().positive().max(10000),
      paymentMethod: z.enum(["card", "bank", "mobile"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get user and wallet
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

      const wallet = await ctx.db
        .select()
        .from(eventWallets)
        .where(
          and(
            eq(eventWallets.eventId, event[0].id),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!wallet[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet not found",
        });
      }

      // Process payment (in real app, integrate with payment provider)
      // For now, just update the balance

      const newBalance = parseFloat(wallet[0].balance) + input.amount;
      const newTotalEarned = parseFloat(wallet[0].totalEarned) + input.amount;

      // Update wallet balance
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
        type: "topup",
        amount: input.amount.toFixed(2),
        description: `Wallet top-up via ${input.paymentMethod}`,
        metadata: JSON.stringify({ paymentMethod: input.paymentMethod }),
      });

      return {
        success: true,
        newBalance: newBalance.toFixed(2),
      };
    }),

  // Create payment
  createPayment: publicProcedure
    .input(z.object({
      eventSlug: z.string(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
      amount: z.number().positive(),
      description: z.string().optional(),
      recipientAddress: z.string().optional(), // For P2P payments
      paymentMethod: z.enum(["qr", "nfc", "manual"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get user and wallet
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

      const wallet = await ctx.db
        .select()
        .from(eventWallets)
        .where(
          and(
            eq(eventWallets.eventId, event[0].id),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!wallet[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet not found",
        });
      }

      // Check sufficient balance
      const currentBalance = parseFloat(wallet[0].balance);
      if (currentBalance < input.amount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient balance",
        });
      }

      // Update wallet balance
      const newBalance = currentBalance - input.amount;
      const newTotalSpent = parseFloat(wallet[0].totalSpent) + input.amount;

      await ctx.db
        .update(eventWallets)
        .set({
          balance: newBalance.toFixed(2),
          totalSpent: newTotalSpent.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(eventWallets.id, wallet[0].id));

      // Create transaction record
      await ctx.db.insert(transactions).values({
        eventWalletId: wallet[0].id,
        type: "payment",
        amount: input.amount.toFixed(2),
        description: input.description || "Payment",
        metadata: JSON.stringify({
          paymentMethod: input.paymentMethod,
          recipientAddress: input.recipientAddress,
        }),
      });

      return {
        success: true,
        newBalance: newBalance.toFixed(2),
      };
    }),
}); 