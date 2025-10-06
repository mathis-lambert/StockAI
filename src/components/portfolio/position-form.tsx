"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "create" | "edit";

type PositionFormProps = {
  mode: Mode;
  defaultValues?: {
    id?: string;
    symbol: string;
    quantity: number;
    averagePrice: number;
  };
  onCancel: () => void;
  onSuccess: () => void;
};

export function PositionForm({
  mode,
  defaultValues,
  onCancel,
  onSuccess,
}: PositionFormProps) {
  const router = useRouter();
  const [symbol, setSymbol] = useState(defaultValues?.symbol ?? "");
  const [quantity, setQuantity] = useState(
    defaultValues ? String(defaultValues.quantity) : "",
  );
  const [averagePrice, setAveragePrice] = useState(
    defaultValues ? String(defaultValues.averagePrice) : "",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultValues) {
      setSymbol(defaultValues.symbol);
      setQuantity(String(defaultValues.quantity));
      setAveragePrice(String(defaultValues.averagePrice));
    } else {
      setSymbol("");
      setQuantity("");
      setAveragePrice("");
    }
  }, [defaultValues]);

  const title =
    mode === "create" ? "Ajouter une position" : "Mettre à jour la position";

  const submitLabel = mode === "create" ? "Enregistrer" : "Mettre à jour";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!symbol.trim()) {
      setFormError("Le symbole est requis.");
      return;
    }

    const payload = {
      symbol,
      quantity: Number(quantity),
      averagePrice: Number(averagePrice),
    };

    if (!Number.isFinite(payload.quantity) || payload.quantity <= 0) {
      setFormError("La quantité doit être supérieure à 0.");
      return;
    }

    if (!Number.isFinite(payload.averagePrice) || payload.averagePrice < 0) {
      setFormError("Le prix moyen doit être supérieur ou égal à 0.");
      return;
    }

    try {
      setIsSubmitting(true);

      const endpoint =
        mode === "create"
          ? "/api/portfolio/positions"
          : `/api/portfolio/positions/${defaultValues?.id}`;

      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message ??
          "Impossible d'enregistrer la position. Réessayez.";
        setFormError(message);
        return;
      }

      toast.success(
        mode === "create"
          ? "Position ajoutée avec succès."
          : "Position mise à jour.",
      );

      router.refresh();
      onSuccess();
    } catch (error) {
      console.error("portfolio.position.submit", error);
      setFormError("Une erreur inattendue est survenue. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border/60 bg-background p-4 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          Renseignez le symbole, la quantité et votre prix d&apos;entrée moyen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Symbole
          </label>
          <Input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            placeholder="ex: AAPL"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Quantité
          </label>
          <Input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            type="number"
            min="0"
            step="1"
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Prix moyen (€)
          </label>
          <Input
            value={averagePrice}
            onChange={(event) => setAveragePrice(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      {formError ? (
        <p className="mt-4 text-sm text-destructive">{formError}</p>
      ) : null}

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
