"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigationLinks: Array<{ href: string; label: string }> = [
  { href: "/portfolio", label: "Portefeuille" },
  { href: "/me", label: "Mon espace" },
];

export function Navbar() {
  const pathname = usePathname();

  const shouldHideNavbar = ["/login", "/register"].some((route) =>
    pathname?.startsWith(route),
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/portfolio"
          className="flex items-center gap-3 rounded-md px-2 py-1 transition hover:bg-accent"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-tight">
              StockAI
            </span>
            <span className="text-xs text-muted-foreground">
              Secure Access Portal
            </span>
          </span>
          <span className="text-sm font-semibold sm:hidden">StockAI</span>
        </Link>

        <Separator orientation="vertical" className="hidden h-8 sm:flex" />

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {navigationLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <Button
                key={href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "px-3 text-sm font-medium",
                  isActive ? "shadow-sm" : "text-muted-foreground",
                )}
              >
                <Link href={href} aria-current={isActive ? "page" : undefined}>
                  {label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Separator orientation="vertical" className="hidden h-8 sm:flex" />

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              "hidden sm:inline-flex",
              pathname === "/me" &&
                "border-primary/40 bg-primary/5 text-foreground",
            )}
          >
            <Link href="/me">Mon profil</Link>
          </Button>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
