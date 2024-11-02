import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export interface User {
  id: string;
  email: string;
  role: string;
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  /**
   * Checks if the token is valid and gets the user
   * from the access token passed by client
   *
   * Acts as a middleware to check if the user is authenticated
   */
  async function getUserFromHeader(): Promise<User | null> {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token);

        if (error || !user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email!,
          role: user.role as string,
        };
      } catch {
        return null;
      }
    }
    return null;
  }

  const user = await getUserFromHeader();

  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
