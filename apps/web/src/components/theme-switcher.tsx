"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="bg-background border border-border w-full rounded-lg p-5 py-2 mb-2 text-secondary-foreground text-base hover:bg-secondary/90 focus:ring-1 ring-ring ring-offset-1 group flex justify-center items-center gap-2"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      Switch theme
    </button>
  );
}
