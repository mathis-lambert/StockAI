"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSignOut = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    try {
      const response = await signOut({
        callbackUrl: "/login",
        redirect: false,
      });

      const nextUrl = response?.url ?? "/login";
      router.push(nextUrl);
      router.refresh();
    } catch (error) {
      toast.error("Impossible de se déconnecter. Réessayez.");
      console.error("auth.signOut", error);
    } finally {
      setIsPending(false);
    }
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
