"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps = {}) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentTheme = resolvedTheme ?? theme ?? "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  const handleToggle = () => {
    setTheme(nextTheme);
  };

  const label =
    currentTheme === "dark"
      ? "Activer le mode clair"
      : "Activer le mode sombre";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      className={cn(
        "relative h-10 w-10 rounded-full border border-border/60 bg-background/80 shadow-sm backdrop-blur transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:bg-background/60",
        className,
      )}
      onClick={handleToggle}
    >
      {isMounted ? (
        <>
          <Sun className="h-5 w-5 transition duration-200 dark:hidden" />
          <Moon className="hidden h-5 w-5 transition duration-200 dark:block" />
        </>
      ) : (
        <Sun className="h-5 w-5 opacity-80" />
      )}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
