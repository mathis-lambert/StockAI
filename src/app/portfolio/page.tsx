import Link from "next/link";
import { Metadata } from "next";
import { PositionsTable } from "@/components/portfolio/positions-table";
import { listPositionsForUser } from "@/lib/portfolio";
import { requireUser } from "@/lib/session";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "StockAI | Portefeuille",
  description: "Gérez vos positions et mettez à jour votre portefeuille.",
};

export default async function PortfolioPage() {
  const session = await requireUser("/login");
  const userId = session.user?.id;

  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }

  const positions = await listPositionsForUser(userId);

  const serializedPositions = positions.map((position) => ({
    id: position._id.toHexString(),
    symbol: position.symbol,
    quantity: position.quantity,
    averagePrice: position.averagePrice,
    createdAt: position.createdAt.toISOString(),
    updatedAt: position.updatedAt.toISOString(),
  }));

  const currencyFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  const quantityFormatter = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  });

  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const aggregates = serializedPositions.reduce(
    (acc, position) => {
      const estimatedValue = position.quantity * position.averagePrice;
      const updatedAt = new Date(position.updatedAt);

      acc.totalInvested += estimatedValue;
      acc.totalQuantity += position.quantity;

      if (!acc.lastUpdated || updatedAt > acc.lastUpdated) {
        acc.lastUpdated = updatedAt;
      }

      return acc;
    },
    {
      totalInvested: 0,
      totalQuantity: 0,
      lastUpdated: null as Date | null,
    },
  );

  const hasPositions = serializedPositions.length > 0;
  const formattedTotalInvested = currencyFormatter.format(
    aggregates.totalInvested,
  );
  const formattedTotalQuantity = quantityFormatter.format(
    aggregates.totalQuantity,
  );
  const latestUpdateLabel = aggregates.lastUpdated
    ? dateFormatter.format(aggregates.lastUpdated)
    : "-";

  const quickStats = [
    {
      label: "Positions suivies",
      value: serializedPositions.length.toString(),
    },
    {
      label: "Titres cumulés",
      value: hasPositions ? formattedTotalQuantity : "-",
    },
    {
      label: "Dernière mise à jour",
      value: aggregates.lastUpdated ? latestUpdateLabel : "-",
    },
  ];

  return (
    <section className="relative isolate flex-1">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72" />
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:px-10">
        <header className="overflow-hidden rounded-4xl border border-border/60 bg-card/90 p-8 shadow-lg backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70 dark:text-primary/80">
                Vue d&apos;ensemble
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Portefeuille
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground dark:text-muted-foreground/80">
                  Consolidez vos positions, gardez une trace de votre exposition
                  globale et identifiez les lignes à rééquilibrer.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-6 shadow-inner dark:border-primary/40 dark:from-primary/20 dark:via-primary/10">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-primary/80">
                Capital suivi
              </span>
              <span className="text-3xl font-semibold text-foreground">
                {formattedTotalInvested}
              </span>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground/80">
                {hasPositions
                  ? `${formattedTotalQuantity} titres suivis • Dernière mise à jour ${latestUpdateLabel}`
                  : "Ajoutez votre première position pour démarrer le suivi."}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div id="positions">
              <PositionsTable positions={serializedPositions} />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground dark:text-primary/80">
                Statistiques rapides
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {quickStats.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-border/60 px-4 py-3"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:text-muted-foreground/80">
                      {label}
                    </dt>
                    <dd className="text-base font-semibold text-foreground dark:text-primary/80">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="overflow-hidden rounded-3xl border border-primary/40 bg-primary/10 p-6 shadow-inner dark:border-primary/50 dark:bg-primary/15">
              <h2 className="text-base font-semibold text-primary dark:text-primary/80">
                Actions rapides
              </h2>
              <p className="mt-2 text-sm text-primary/80 dark:text-muted-foreground/80">
                Mettez à jour vos positions dès qu&apos;une opération est
                réalisée pour garder un historique fiable.
              </p>
              <Button
                asChild
                className="mt-4 w-full rounded-full px-5 shadow-sm"
                variant="default"
              >
                <Link href="#positions">Gérer mes positions</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
