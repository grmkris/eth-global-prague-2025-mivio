import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eventChannels, eventWallets, users, events } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const channelRouter = createTRPCRouter({
  // Initialize channel creation after event join
  initializeChannel: publicProcedure
    .input(z.object({
      eventSlug: z.string(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    }))
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

      // Get event wallet
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
          message: "Event wallet not found. Please join the event first.",
        });
      }

      // Check if channel already exists
      const existingChannel = await ctx.db
        .select()
        .from(eventChannels)
        .where(eq(eventChannels.eventWalletId, wallet[0].id))
        .limit(1);

      if (existingChannel[0]) {
        return {
          success: true,
          channelId: existingChannel[0].id,
          status: existingChannel[0].status,
          message: "Channel already exists",
        };
      }

      // Create channel record
      const channel = await ctx.db
        .insert(eventChannels)
        .values({
          eventWalletId: wallet[0]!.id,
          status: "pending",
        })
        .returning();

      return {
        success: true,
        channelId: channel[0]!.id,
        eventWalletId: wallet[0]!.id,
        status: "pending",
        message: "Channel initialization started",
      };
    }),

  // Confirm channel creation
  confirmChannel: publicProcedure
    .input(z.object({
      channelId: z.number(),
      nitroliteChannelId: z.string(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    }))
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

      // Get channel
      const channel = await ctx.db
        .select({
          channel: eventChannels,
          wallet: eventWallets,
        })
        .from(eventChannels)
        .innerJoin(eventWallets, eq(eventChannels.eventWalletId, eventWallets.id))
        .where(
          and(
            eq(eventChannels.id, input.channelId),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!channel[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Channel not found",
        });
      }

      // Update channel with Nitrolite channel ID
      await ctx.db
        .update(eventChannels)
        .set({
          channelId: input.nitroliteChannelId,
          status: "open",
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(eventChannels.id, input.channelId));

      return {
        success: true,
        message: "Channel confirmed and ready for use",
      };
    }),

  // Get channel status
  getChannelStatus: publicProcedure
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

      // Get channel with wallet info
      const channelData = await ctx.db
        .select({
          channelId: eventChannels.id,
          nitroliteChannelId: eventChannels.channelId,
          status: eventChannels.status,
          offchainBalance: eventChannels.offchainBalance,
          lockedBalance: eventChannels.lockedBalance,
          lastActivityAt: eventChannels.lastActivityAt,
          errorMessage: eventChannels.errorMessage,
          walletBalance: eventWallets.balance,
        })
        .from(eventChannels)
        .innerJoin(eventWallets, eq(eventChannels.eventWalletId, eventWallets.id))
        .where(
          and(
            eq(eventWallets.eventId, event[0].id),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!channelData[0]?.channelId) {
        return {
          hasChannel: false,
          needsChannel: true,
        };
      }

      return {
        hasChannel: true,
        ...channelData[0]!,
      };
    }),

  // Update channel status (called by client after WebSocket operations)
  updateChannelStatus: publicProcedure
    .input(z.object({
      channelId: z.number(),
      status: z.enum(["pending", "connecting", "open", "closing", "closed", "failed"]),
      errorMessage: z.string().optional(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    }))
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

      // Verify channel ownership
      const channel = await ctx.db
        .select()
        .from(eventChannels)
        .innerJoin(eventWallets, eq(eventChannels.eventWalletId, eventWallets.id))
        .where(
          and(
            eq(eventChannels.id, input.channelId),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!channel[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Channel not found or unauthorized",
        });
      }

      // Update status
      await ctx.db
        .update(eventChannels)
        .set({
          status: input.status,
          errorMessage: input.errorMessage,
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(eventChannels.id, input.channelId));

      return {
        success: true,
        status: input.status,
      };
    }),

  // Update off-chain balance
  updateOffchainBalance: publicProcedure
    .input(z.object({
      channelId: z.number(),
      offchainBalance: z.string(),
      lockedBalance: z.string().optional(),
      walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    }))
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

      // Verify channel ownership
      const channel = await ctx.db
        .select()
        .from(eventChannels)
        .innerJoin(eventWallets, eq(eventChannels.eventWalletId, eventWallets.id))
        .where(
          and(
            eq(eventChannels.id, input.channelId),
            eq(eventWallets.userId, user[0].id)
          )
        )
        .limit(1);

      if (!channel[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Channel not found or unauthorized",
        });
      }

      // Update balance
      const updateData: any = {
        offchainBalance: input.offchainBalance,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      };

      if (input.lockedBalance !== undefined) {
        updateData.lockedBalance = input.lockedBalance;
      }

      await ctx.db
        .update(eventChannels)
        .set(updateData)
        .where(eq(eventChannels.id, input.channelId));

      return {
        success: true,
        offchainBalance: input.offchainBalance,
        lockedBalance: input.lockedBalance,
      };
    }),
}); 