import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import {
  createPositionForUser,
  listPositionsForUser,
  type PortfolioPositionDocument,
} from "@/lib/portfolio";
import { positionInputSchema } from "@/lib/validations/portfolio";

function serializePosition(position: PortfolioPositionDocument) {
  return {
    id: position._id.toHexString(),
    symbol: position.symbol,
    quantity: position.quantity,
    averagePrice: position.averagePrice,
    createdAt: position.createdAt.toISOString(),
    updatedAt: position.updatedAt.toISOString(),
  };
}

async function requireApiUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

export async function GET() {
  try {
    const userId = await requireApiUser();
    if (!userId) {
      return NextResponse.json(
        { message: "Authentification requise" },
        { status: 401 },
      );
    }

    const positions = await listPositionsForUser(userId);

    return NextResponse.json({
      positions: positions.map(serializePosition),
    });
  } catch (error) {
    console.error("portfolio.positions.list", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des positions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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

    const position = await createPositionForUser(userId, parsed.data);
    if (!position) {
      return NextResponse.json(
        { message: "Impossible de créer la position" },
        { status: 500 },
      );
    }

    revalidatePath("/portfolio");

    return NextResponse.json(
      { position: serializePosition(position) },
      { status: 201 },
    );
  } catch (error) {
    console.error("portfolio.positions.create", error);
    return NextResponse.json(
      { message: "Erreur lors de la création de la position" },
      { status: 500 },
    );
  }
}
