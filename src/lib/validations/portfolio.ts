import { z } from "zod";

export const positionInputSchema = z.object({
  symbol: z
    .string({ error: "Le symbole est requis" })
    .trim()
    .min(1, "Le symbole est requis")
    .max(12, "Maximum 12 caractères")
    .transform((value) => value.toUpperCase()),
  quantity: z.coerce
    .number({ error: "La quantité est requise" })
    .positive("La quantité doit être supérieure à 0"),
  averagePrice: z.coerce
    .number({ error: "Le prix moyen est requis" })
    .nonnegative("Le prix doit être positif ou nul"),
});

export type PositionInput = z.infer<typeof positionInputSchema>;
