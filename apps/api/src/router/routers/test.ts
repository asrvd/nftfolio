import { z } from "zod";
import { publicProcedure, router } from "../../router/trpc";

export const testRouter = router({
  version: publicProcedure.query(() => {
    console.log("version");
    return { version: "0.42.0" };
  }),
  hello: publicProcedure
    .input(z.object({ username: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        text: `hello ${input?.username ?? "world"}`,
      };
    }),
});
