import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "../router/context";
import { TRPCError } from "@trpc/server";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Protected procedure to check if the user is authenticated,
 * uses the `user` object passed from the context to check if the user is authenticated
 */
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;

    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: {
        user: ctx.user,
      },
    });
  }
);
