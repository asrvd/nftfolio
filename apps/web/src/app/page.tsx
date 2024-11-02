import { createClient } from "@/src/utils/supabase/server";
import SignInButton from "../components/signInButton";
import Link from "next/link";
import GridPattern from "../components/grid-pattern";
import { cn } from "../utils/cn";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background/50 backdrop-blur-sm overflow-hidden">
      <GridPattern
        maxOpacity={0.2}
        numSquares={100}
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-40%] h-[200%] skew-y-12 -z-10 overflow-hidden"
        )}
      />
      <div className="flex flex-col gap-4 justify-between items-center p-4 lg:w-2/3 w-full text-center z-10">
        <h1 className="lg:text-7xl text-4xl font-black text-foreground">
          Seamless, Secure, Simple NFT Portfolio Management 🚀
        </h1>
        <p className="text-lg text-muted-foreground">
          nftFolio is a simple NFT portfolio & asset manager. Create and manage
          your digital assets with ease.
        </p>
        {user ? (
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="bg-primary w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
            >
              Go to dashboard
            </Link>
            <Link
              href="/explore"
              className="bg-primary w-max rounded-lg p-5 py-2 text-primary-foreground text-base hover:bg-primary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
            >
              Explore assets
            </Link>
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    </main>
  );
}
