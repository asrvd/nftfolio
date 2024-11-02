import { createClient } from "@/src/utils/supabase/server";
import Asset from "@/src/components/asset";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/"); // Redirect to the home page if the user is not logged in
  }

  const id = (await params).id;
  
  return (
    <main className="flex flex-col items-center justify-start min-h-screen w-full bg-background">
      <Asset user={user} assetId={id} />
    </main>
  );
}
