"use server";

import { getAllIncomes } from "@/app/(dashboard)/incomes/get-incomes";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const incomes = await getAllIncomes();
    return NextResponse.json({ incomes });
  } catch (err) {
    console.error("Erreur API incomes GET:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des revenus.",
      },
      { status: 500 }
    );
  }
}
