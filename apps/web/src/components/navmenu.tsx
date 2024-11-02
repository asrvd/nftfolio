"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSection,
} from "@headlessui/react";
import type { UserResponse } from "@supabase/supabase-js";
import Link from "next/link";
import SignOutButton from "./signOutButton";
import ThemeSwitcher from "./theme-switcher";
import { Home, LayoutDashboard, LogOut, Globe } from "lucide-react";

export default function NavMenu({
  user,
}: {
  user: UserResponse["data"]["user"];
}) {
  return (
    <Menu>
      <MenuButton>
        <img
          src={`https://api.dicebear.com/9.x/glass/svg?seed=${user!.email}`}
          alt="User avatar"
          className="bg-cover rounded-full lg:w-12 lg:h-12 w-10 h-10"
        />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="bg-popover gap-2 backdrop-blur-sm text-popover-foreground p-2 rounded-lg shadow-sm border border-border mt-2 w-[200px]"
      >
        <MenuItem>
          <Link
            className="hover:bg-accent w-full rounded-lg p-2 flex items-center gap-2"
            href="/"
          >
            <Home size={16} />
            Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            className="hover:bg-accent w-full rounded-lg p-2 flex items-center gap-2"
            href="/dashboard"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            className="hover:bg-accent w-full rounded-lg p-2 mb-2 flex items-center gap-2"
            href="/explore"
          >
            <Globe size={16} />
            Explore
          </Link>
        </MenuItem>
        <MenuItem>
          <ThemeSwitcher />
        </MenuItem>
        <MenuItem>
          <SignOutButton />
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
