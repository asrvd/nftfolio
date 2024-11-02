import { createClient } from "../utils/supabase/server";
import SignInButton from "../components/signInButton";
import SignOutButton from "./signOutButton";
import NavMenu from "./navmenu";
import Link from "next/link";

export default async function NavBar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex justify-between p-2 lg:px-16 px-2 bg-background/10 backdrop-blur-md w-full gap-4 border-b border-border sticky top-0 z-10">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-xl font-bold">nftFolio</h1>
        </Link>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <NavMenu user={user} />
        </div>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}
