import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { appRouter } from "./router";
import { createContext } from "./router/context";
import cors from "@fastify/cors";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? "/trpc";
  const server = fastify({ logger: dev });

  // cors middleware/plugin
  server.register(cors, {
    origin: "*",
  });

  // tRPC plugin
  void server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: { router: appRouter, createContext },
  });

  server.get("/", async () => {
    return { hello: "world" };
  });

  const stop = async () => {
    await server.close();
  };

  const start = async () => {
    try {
      await server.listen({ port });
      console.log("listening on port", port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}
