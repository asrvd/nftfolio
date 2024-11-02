import type { AppRouter } from "@repo/api/src/router"; // type imported from api directory
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
