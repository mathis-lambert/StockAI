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
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Mes positions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Un aperçu rapide des titres que vous détenez actuellement.
            </p>
          </div>
          <Button onClick={() => setFormState({ mode: "create" })}>
            Ajouter une position
          </Button>
        </CardHeader>
        <Separator className="bg-border" />
        <CardContent className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Symbole</th>
                  <th className="px-4 py-3 font-medium">Quantité</th>
                  <th className="px-4 py-3 font-medium">Prix moyen</th>
                  <th className="px-4 py-3 font-medium">Valeur estimée</th>
                  <th className="px-4 py-3 font-medium">Mis à jour</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {positions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      Aucune position enregistrée pour le moment. Ajoutez votre
                      première ligne en cliquant sur &laquo;&nbsp;Ajouter une
                      position&nbsp;&raquo;.
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => {
                    const marketValue =
                      position.quantity * position.averagePrice;
                    return (
                      <tr
                        key={position.id}
                        className="transition hover:bg-muted/40"
                      >
                        <td className="py-3 pr-4 font-medium">
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
                          {lastUpdatedFormatter.format(
                            new Date(position.updatedAt),
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
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
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeletePosition(position)}
                              disabled={pendingDeleteId === position.id}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
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
        <DialogContent className="sm:max-w-2xl">
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
        <DialogContent className="sm:max-w-md">
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDeletePosition(null)}
                  disabled={pendingDeleteId === deletePosition.id}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(deletePosition.id)}
                  disabled={pendingDeleteId === deletePosition.id}
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
