import { Metadata } from "next";
import { PositionsTable } from "@/components/portfolio/positions-table";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { listPositionsForUser } from "@/lib/portfolio";
import { requireUser } from "@/lib/session";

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

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Portefeuille</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Consolidez les positions que vous détenez pour suivre votre exposition
          globale.
        </p>
      </header>
      <PortfolioSummary positions={serializedPositions} />
      <PositionsTable positions={serializedPositions} />
    </section>
  );
}
