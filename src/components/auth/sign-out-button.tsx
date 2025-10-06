"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SignOutButtonProps = {
  size?: ComponentProps<typeof Button>["size"];
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
};

export function SignOutButton({
  size = "sm",
  variant = "outline",
  className,
}: SignOutButtonProps = {}) {
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
      variant={variant}
      size={size}
      className={className}
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
