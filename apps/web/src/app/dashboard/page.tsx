import { createClient } from "@/src/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AssetGallery from "@/src/components/assets";
import CreateAssetDialog from "@/src/components/create-asset";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/"); // Redirect to the home page if the user is not logged in 
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 lg:w-2/3 w-full bg-background">
      <div className="flex lg:flex-row flex-col gap-2 justify-between lg:items-center">
        <h2 className="font-extrabold text-3xl leading-none">
          Your NFT Portfolio
        </h2>
        <CreateAssetDialog user={user} />
      </div>
      <AssetGallery user={user} />
    </div>
  );
}
