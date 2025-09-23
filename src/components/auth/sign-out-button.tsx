"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(() => {
      void signOut({ callbackUrl: "/login" });
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          Déconnexion…
        </>
      ) : (
        "Se déconnecter"
      )}
    </Button>
  );
}
