import { testRouter } from "../router/routers/test";
import { assetRouter } from "../router/routers/asset";
import { router } from "../router/trpc";

export const appRouter = router({
  test: testRouter,
  asset: assetRouter,
});

export type AppRouter = typeof appRouter;
