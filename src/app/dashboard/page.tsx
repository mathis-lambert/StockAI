import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAuthMetricsSnapshot } from "@/lib/metrics";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "StockAI | Tableau de bord",
};

export default async function DashboardPage() {
  await requireUser("/login");

  const metrics = await getAuthMetricsSnapshot();

  const numberFormatter = new Intl.NumberFormat("fr-FR");
  const percentFormatter = new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: 1,
  });
  const durationFormatter = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
  });

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Performance Authentification</CardTitle>
          <CardDescription>
            Suivi temps réel des indicateurs clés : taux de succès, latence et
            sessions engagées.
          </CardDescription>
        </CardHeader>
        <Separator className="bg-border" />
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-background p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Sessions actives
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {numberFormatter.format(metrics.activeSessions)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Sessions ouvertes actuellement via NextAuth.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Taux de succès login
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {percentFormatter.format(metrics.loginSuccessRate)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {numberFormatter.format(metrics.loginSuccess)} succès ·{" "}
              {numberFormatter.format(metrics.loginFailure)} échecs.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Latence moyenne login
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {metrics.avgLoginDurationMs !== null
                ? `${durationFormatter.format(metrics.avgLoginDurationMs)} ms`
                : "—"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Temps moyen constaté sur les authentifications.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Inscriptions réussies
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {numberFormatter.format(metrics.signupSuccess)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {numberFormatter.format(metrics.signupFailure)} tentatives
              refusées.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Rafraîchissements de session
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {numberFormatter.format(metrics.sessionRefresh)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Nombre total de renouvellements côté serveur.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
