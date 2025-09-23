import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { RegisterForm } from "@/components/auth/register-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Créer un compte</h2>
        <p className="text-sm text-muted-foreground">
          Rejoignez StockAI en quelques secondes.
        </p>
      </div>
      <RegisterForm />
      <Separator className="bg-border" />
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Déjà membre ?</span>
        <Button variant="link" size="sm" asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  );
}
