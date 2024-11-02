import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import Explore from "@/src/components/exploreAssets";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/"); // Redirect to the home page if the user is not logged in
  }

  return (
    <main className="flex flex-col justify-start min-h-screen w-full lg:w-2/3 p-4 gap-4 bg-background">
      <Explore user={user} />
    </main>
  );
}
