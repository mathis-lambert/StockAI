import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LoginForm } from "@/components/auth/login-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Se connecter</h2>
        <p className="text-sm text-muted-foreground">
          Utilisez vos identifiants professionnels pour rejoindre la plateforme.
        </p>
      </div>
      <LoginForm />
      <Separator className="bg-border" />
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Pas encore de compte ?</span>
        <Button variant="link" size="sm" asChild>
          <Link href="/register">Créer un compte</Link>
        </Button>
      </div>
    </div>
  );
}
