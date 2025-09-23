import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { createUser, findUserByEmail } from "@/lib/user";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
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
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email" },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 12);

    await createUser({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Compte créé" }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
