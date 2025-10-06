import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { deletePositionForUser, updatePositionForUser } from "@/lib/portfolio";
import { positionInputSchema } from "@/lib/validations/portfolio";

async function requireApiUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

function buildErrorResponse(error: unknown) {
  if (error instanceof Error && error.message === "Identifiant invalide") {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  console.error("portfolio.positions", error);
  return NextResponse.json(
    { message: "Erreur interne du serveur" },
    { status: 500 },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: { positionId: string } },
) {
  try {
    const userId = await requireApiUser();
    if (!userId) {
      return NextResponse.json(
        { message: "Authentification requise" },
        { status: 401 },
      );
    }

    const payload = await request.json();
    const parsed = positionInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation invalide",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const updated = await updatePositionForUser(
      userId,
      params.positionId,
      parsed.data,
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Position introuvable" },
        { status: 404 },
      );
    }

    revalidatePath("/portfolio");

    return NextResponse.json({
      position: {
        id: updated._id.toHexString(),
        symbol: updated.symbol,
        quantity: updated.quantity,
        averagePrice: updated.averagePrice,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    return buildErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { positionId: string } },
) {
  try {
    const userId = await requireApiUser();
    if (!userId) {
      return NextResponse.json(
        { message: "Authentification requise" },
        { status: 401 },
      );
    }

    const deleted = await deletePositionForUser(userId, params.positionId);
    if (!deleted) {
      return NextResponse.json(
        { message: "Position introuvable" },
        { status: 404 },
      );
    }

    revalidatePath("/portfolio");

    return NextResponse.json({ success: true });
  } catch (error) {
    return buildErrorResponse(error);
  }
}
