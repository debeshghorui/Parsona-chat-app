import React from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ theme, setTheme, ready = true }) {
  const isDark = ready && theme === "dark";

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      title="Toggle theme"
      suppressHydrationWarning
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline" suppressHydrationWarning>
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
