"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/navigation/theme-toggle";

const navigationLinks: Array<{ href: string; label: string }> = [
  { href: "/portfolio", label: "Portefeuille" },
  { href: "/quizz", label: "Quiz flashcards" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const shouldHideNavbar = ["/login", "/register"].some((route) =>
    pathname?.startsWith(route),
  );

  React.useEffect(() => {
    if (shouldHideNavbar) {
      return;
    }
    setMobileOpen(false);
  }, [pathname, shouldHideNavbar]);

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/portfolio"
            className="group flex items-center gap-3 rounded-full border border-transparent px-2 py-1 transition hover:border-primary/20 hover:bg-primary/5"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25 transition group-hover:scale-105">
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

          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-background/70 p-1 shadow-sm md:flex">
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
                    "rounded-full px-4 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:inline-flex" />

            <Button
              asChild
              variant="outline"
              size="sm"
              className={cn(
                "hidden lg:inline-flex rounded-full px-4",
                pathname === "/me" &&
                  "border-primary/40 bg-primary/10 text-primary shadow-sm",
              )}
            >
              <Link href="/me">Mon profil</Link>
            </Button>

            <SignOutButton className="hidden sm:inline-flex rounded-full px-4" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-expanded={mobileOpen}
              aria-label="Ouvrir le menu de navigation"
              aria-controls="mobile-navigation"
              className="rounded-full border border-border/60 bg-background/80 shadow-sm transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div id="mobile-navigation" className="pb-4 md:hidden">
            <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/95 p-4 shadow-sm">
              <nav className="flex flex-col gap-2">
                {navigationLinks.map(({ href, label }) => {
                  const isActive =
                    pathname === href || pathname?.startsWith(`${href}/`);
                  return (
                    <Button
                      key={`mobile-${href}`}
                      asChild
                      variant={isActive ? "default" : "outline"}
                      size="lg"
                      className={cn(
                        "justify-between rounded-2xl px-4",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border-border/70 bg-background/90 text-foreground hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(
                    "rounded-2xl px-4",
                    pathname === "/me" &&
                      "border-primary/50 bg-primary/10 text-primary shadow-sm",
                  )}
                >
                  <Link href="/me">Mon profil</Link>
                </Button>

                <SignOutButton
                  size="lg"
                  variant="outline"
                  className="w-full justify-center rounded-2xl px-4"
                />

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      Apparence
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Clair ou sombre, à toi de choisir.
                    </span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
