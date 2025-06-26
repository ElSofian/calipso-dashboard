"use server";

import { getStock } from "@/app/(dashboard)/stock/get-stock";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const stock = await getStock();
    return NextResponse.json({ stock });
  } catch (err) {
    console.error("Erreur API stock GET:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération du stock.",
      },
      { status: 500 }
    );
  }
}
