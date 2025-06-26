"use server";

import { getAllPayments } from "@/app/(dashboard)/payments/get-payments";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payments = await getAllPayments();
    return NextResponse.json({ payments });
  } catch (err) {
    console.error("Erreur API payments GET:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des paiements.",
      },
      { status: 500 }
    );
  }
}
