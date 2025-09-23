import argon2 from "argon2";
import { NextResponse } from "next/server";
import { logAuthError, logAuthInfo } from "@/lib/logger";
import { recordSignupMetrics } from "@/lib/metrics";
import { createUser, findUserByEmail } from "@/lib/user";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      logAuthError("auth.signup", "Validation échouée", {
        errors: parsed.error.flatten().fieldErrors,
      });
      recordSignupMetrics({ success: false });
      return NextResponse.json(
        {
          message: "Validation invalide",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      logAuthError("auth.signup", "Email déjà utilisé", {
        email: normalizedEmail,
      });
      recordSignupMetrics({ success: false });
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email" },
        { status: 409 },
      );
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    logAuthInfo("auth.signup", "Compte créé", {
      email: normalizedEmail,
      userId: user?._id?.toString(),
    });
    recordSignupMetrics({ success: true });

    return NextResponse.json({ message: "Compte créé" }, { status: 201 });
  } catch (error) {
    logAuthError("auth.signup", "Erreur interne", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    recordSignupMetrics({ success: false });
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
