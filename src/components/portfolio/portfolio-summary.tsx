import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PortfolioPosition } from "@/components/portfolio/positions-table";

type PortfolioSummaryProps = {
  positions: PortfolioPosition[];
};

export function PortfolioSummary({ positions }: PortfolioSummaryProps) {
  const { totalValue, totalQuantity } = positions.reduce(
    (acc, position) => {
      const estimatedValue = position.quantity * position.averagePrice;
      acc.totalValue += estimatedValue;
      acc.totalQuantity += position.quantity;
      return acc;
    },
    { totalValue: 0, totalQuantity: 0 },
  );

  const currencyFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  const quantityFormatter = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  });

  const averageTicket =
    positions.length > 0 ? totalValue / positions.length : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Valeur estimée</CardTitle>
          <CardDescription>
            Basée sur vos prix d&apos;entrée moyens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {currencyFormatter.format(totalValue)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Lignes en portefeuille
          </CardTitle>
          <CardDescription>Nombre total de titres enregistrés.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{positions.length}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Ticket moyen par ligne
          </CardTitle>
          <CardDescription>Répartition moyenne par position.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {positions.length > 0
              ? currencyFormatter.format(averageTicket)
              : currencyFormatter.format(0)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {quantityFormatter.format(totalQuantity)} titres au total.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
