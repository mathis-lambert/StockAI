import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: "Le nom est requis" })
      .min(2, "Le nom doit comporter au moins 2 caractères"),
    email: z
      .string({ required_error: "L'email est requis" })
      .email("Email invalide"),
    password: z
      .string({ required_error: "Le mot de passe est requis" })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Doit contenir une majuscule, une minuscule et un chiffre",
      ),
    confirmPassword: z.string({
      required_error: "La confirmation est requise",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .email("Email invalide"),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});
