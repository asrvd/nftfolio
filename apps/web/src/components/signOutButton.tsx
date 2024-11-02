"use client";

import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      className="bg-background border border-border w-full rounded-lg p-5 py-2 text-secondary-foreground text-base hover:bg-secondary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
      onClick={handleSignOut}
    >
      <LogOut size={16} />
      Sign Out
    </button>
  );
}
