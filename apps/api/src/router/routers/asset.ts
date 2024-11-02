import { z } from "zod";
import { router, protectedProcedure } from "../../router/trpc";
import { db } from "../../lib/db";
import { assets, transactions, profiles } from "../../lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const assetRouter = router({
  /**
   * Get all assets from the database
   * @returns all assets
   */
  list: protectedProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        if (input.searchQuery) {
          return await db.query.assets.findMany({
            where: (assets, { or, ilike }) =>
              or( // search by name, id, description, owner email
                ilike(assets.name, `%${input.searchQuery}%`),
                sql`CAST(${assets.id} AS TEXT) ILIKE ${`%${input.searchQuery}%`}`,
                ilike(assets.description, `%${input.searchQuery}%`),
                ilike(assets.ownerEmail, `%${input.searchQuery}%`)
              ),
            with: {
              owner: true,
            },
            orderBy: (assets, { desc }) => [desc(assets.createdAt)],
          });
        }
        return await db.query.assets.findMany({
          orderBy: desc(assets.createdAt),
          with: { owner: true },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  /**
   * Get all assets for a user
   * @param input - userId to get assets for
   * @returns assets for the user
   */
  getAll: protectedProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return await db.query.assets.findMany({
          where: eq(assets.ownerId, input.userId),
          orderBy: desc(assets.createdAt),
        });
      } catch (error) {
        console.log(error);
      }
    }),

  /**
   * Get a single asset by id
   * @param input - id of the asset
   * @returns asset
   */
  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        return await db.query.assets.findFirst({
          where: eq(assets.id, input.id),
          with: {
            transactions: {
              orderBy: desc(transactions.createdAt),
            },
            owner: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  /**
   * Create a new asset
   * @param input - name, description?, assetUrl, ownerId
   * @returns created asset
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        assetUrl: z.string().min(1),
        ownerId: z.string().min(1),
        ownerEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await db.insert(assets).values(input);
    }),

  /**
   * Transfer an asset to another user
   * @param input - assetId, fromUserId, toUserEmail
   * @returns transaction
   */
  transfer: protectedProcedure
    .input(
      z.object({
        assetId: z.string().min(1),
        fromUserId: z.string().min(1),
        toUserEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.fromUserId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await db.transaction(async (trx) => {
        const fromUser = await trx.query.profiles.findFirst({
          where: eq(profiles.id, input.fromUserId),
        });
        const toUser = await trx.query.profiles.findFirst({
          where: eq(profiles.email, input.toUserEmail),
        });
        if (!toUser || !fromUser) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        await trx
          .update(assets)
          .set({ ownerId: toUser.id })
          .where(
            and(
              eq(assets.ownerId, input.fromUserId),
              eq(assets.id, input.assetId)
            )
          );

        return await trx.insert(transactions).values({
          fromUserEmail: fromUser.email,
          toUserEmail: toUser.email,
          fromUserId: input.fromUserId,
          toUserId: toUser.id,
          assetId: input.assetId,
        });
      });
    }),

  /**
   * Delete an asset
   * @param input - id, ownerId
   * @returns deleted asset
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1), ownerId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (input.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return await db.delete(assets).where(eq(assets.id, input.id));
    }),

  /**
   * Update an asset
   * @param input - id, ownerId, name?, description?, assetUrl?
   * @returns updated asset
   */
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        ownerId: z.string().min(1),
        name: z.string().optional(),
        description: z.string().optional(),
        assetUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      if (!input.name && !input.description && !input.assetUrl) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      return await db.update(assets).set(input).where(eq(assets.id, input.id));
    }),
});

export type AssetRouter = typeof assetRouter;
