import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "StockAI | Tableau de bord",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name ?? "Utilisateur";
  const userEmail = session.user.email ?? "Email non renseigné";

  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Bienvenue,</p>
            <p className="text-lg font-semibold">{userName}</p>
          </div>
          <SignOutButton />
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Point de contrôle de sécurité</CardTitle>
            <CardDescription>
              Gestion centralisée des accès et vision instantanée de votre
              espace de travail.
            </CardDescription>
          </CardHeader>
          <Separator className="bg-border" />
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-background p-6">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="mt-1 text-lg font-semibold">{userEmail}</p>
            </div>
            <div className="rounded-xl border bg-background p-6">
              <p className="text-sm font-medium text-muted-foreground">
                Statut
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-600">
                Actif
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
