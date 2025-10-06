"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PositionForm } from "@/components/portfolio/position-form";

export type PortfolioPosition = {
  id: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  createdAt: string;
  updatedAt: string;
};

type FormState =
  | { mode: "create" }
  | { mode: "edit"; position: PortfolioPosition };

type PositionsTableProps = {
  positions: PortfolioPosition[];
};

export function PositionsTable({ positions }: PositionsTableProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletePosition, setDeletePosition] =
    useState<PortfolioPosition | null>(null);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }),
    [],
  );

  const quantityFormatter = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 2,
      }),
    [],
  );

  const lastUpdatedFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [],
  );

  const isDialogOpen = formState !== null;
  const isDeleteDialogOpen = deletePosition !== null;

  const dialogCopy =
    formState?.mode === "edit"
      ? {
          title: "Mettre à jour la position",
          description:
            "Ajustez la quantité ou le prix moyen pour refléter vos dernières transactions.",
        }
      : {
          title: "Ajouter une position",
          description:
            "Renseignez le symbole, la quantité et votre prix d'entrée moyen.",
        };

  const handleDelete = async (positionId: string) => {
    try {
      setPendingDeleteId(positionId);

      const response = await fetch(`/api/portfolio/positions/${positionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.message ??
          "Impossible de supprimer la position pour le moment.";
        toast.error(message);
        return;
      }

      toast.success("Position supprimée.");
      setDeletePosition(null);
      router.refresh();
    } catch (error) {
      console.error("portfolio.position.delete", error);
      toast.error("La suppression a échoué. Réessayez.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      <Card className="rounded-3xl border border-border/60 bg-card shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-foreground">
              Mes positions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Un aperçu rapide des titres que vous détenez actuellement.
            </p>
          </div>
          <Button
            onClick={() => setFormState({ mode: "create" })}
            className="self-start rounded-full px-5 shadow-sm lg:self-auto"
          >
            Ajouter une position
          </Button>
        </CardHeader>
        <Separator className="bg-border/60" />
        <CardContent className="space-y-6">
          {positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-primary/40 bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-inner">
              <p>
                Aucune position enregistrée pour le moment. Ajoutez votre
                première ligne en cliquant sur &nbsp;&laquo;&nbsp;Ajouter une
                position&nbsp;&raquo;.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-inner">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="py-3 pl-4 pr-4 font-medium">Symbole</th>
                        <th className="px-4 py-3 font-medium">Quantité</th>
                        <th className="px-4 py-3 font-medium">Prix moyen</th>
                        <th className="px-4 py-3 font-medium">
                          Valeur estimée
                        </th>
                        <th className="px-4 py-3 font-medium">Mis à jour</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {positions.map((position) => {
                        const marketValue =
                          position.quantity * position.averagePrice;
                        const updatedAt = lastUpdatedFormatter.format(
                          new Date(position.updatedAt),
                        );
                        return (
                          <tr
                            key={position.id}
                            className="transition hover:bg-primary/5 dark:hover:bg-white/5"
                          >
                            <td className="py-3 pl-4 pr-4 font-semibold">
                              {position.symbol}
                            </td>
                            <td className="px-4 py-3">
                              {quantityFormatter.format(position.quantity)}
                            </td>
                            <td className="px-4 py-3">
                              {currencyFormatter.format(position.averagePrice)}
                            </td>
                            <td className="px-4 py-3">
                              {currencyFormatter.format(marketValue)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {updatedAt}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full px-4"
                                  onClick={() =>
                                    setFormState({
                                      mode: "edit",
                                      position,
                                    })
                                  }
                                >
                                  Mettre à jour
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="rounded-full px-3 text-destructive hover:text-destructive"
                                  onClick={() => setDeletePosition(position)}
                                  disabled={pendingDeleteId === position.id}
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-3 md:hidden">
                {positions.map((position) => {
                  const marketValue = position.quantity * position.averagePrice;
                  const updatedAt = lastUpdatedFormatter.format(
                    new Date(position.updatedAt),
                  );
                  return (
                    <div
                      key={`card-${position.id}`}
                      className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            {position.symbol}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Mis à jour le {updatedAt}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Quantité
                          </p>
                          <p className="font-semibold text-foreground">
                            {quantityFormatter.format(position.quantity)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">
                            Prix moyen
                          </p>
                          <p className="font-semibold text-foreground">
                            {currencyFormatter.format(position.averagePrice)}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs uppercase text-muted-foreground">
                            Valeur estimée
                          </p>
                          <p className="text-base font-semibold text-primary">
                            {currencyFormatter.format(marketValue)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full px-4"
                          onClick={() =>
                            setFormState({
                              mode: "edit",
                              position,
                            })
                          }
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full px-3 text-destructive hover:text-destructive"
                          onClick={() => setDeletePosition(position)}
                          disabled={pendingDeleteId === position.id}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormState(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl sm:rounded-3xl border border-border/60 bg-card shadow-xl">
          {formState ? (
            <>
              <DialogHeader>
                <DialogTitle>{dialogCopy.title}</DialogTitle>
                <DialogDescription>{dialogCopy.description}</DialogDescription>
              </DialogHeader>
              <PositionForm
                key={
                  formState.mode === "create"
                    ? "create"
                    : `edit-${formState.position.id}`
                }
                mode={formState.mode}
                defaultValues={
                  formState.mode === "edit"
                    ? {
                        id: formState.position.id,
                        symbol: formState.position.symbol,
                        quantity: formState.position.quantity,
                        averagePrice: formState.position.averagePrice,
                      }
                    : undefined
                }
                onCancel={() => setFormState(null)}
                onSuccess={() => setFormState(null)}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePosition(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md sm:rounded-3xl border border-border/60 bg-card shadow-xl">
          {deletePosition ? (
            <>
              <DialogHeader>
                <DialogTitle>Supprimer la position</DialogTitle>
                <DialogDescription>
                  Confirmez la suppression de{" "}
                  <span className="font-medium text-foreground">
                    {deletePosition.symbol}
                  </span>
                  . Cette action est définitive.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeletePosition(null)}
                  disabled={pendingDeleteId === deletePosition.id}
                  className="rounded-full px-4"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(deletePosition.id)}
                  disabled={pendingDeleteId === deletePosition.id}
                  className="rounded-full px-4"
                >
                  Supprimer
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
