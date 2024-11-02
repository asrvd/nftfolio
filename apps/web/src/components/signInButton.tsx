"use client";

import { createClient } from "../utils/supabase/client";
import { LogIn } from "lucide-react";

export default function SignInButton() {
  const supabase = createClient();
  const origin = process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";
  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${origin}/auth/callback?redirect_to=/`,
      },
    });
    if (error) {
      console.error("Error signing in with Discord:", error.message);
    }
  };
  return (
    <button
      className="bg-primary w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
      onClick={signInWithDiscord}
    >
      Sign in
      <LogIn size={16} />
    </button>
  );
}
