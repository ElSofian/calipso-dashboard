"use server";

import { getAllEmployees } from "@/app/(dashboard)/employees/get-employees";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const employees = await getAllEmployees();
    return NextResponse.json({ employees });
  } catch (err) {
    console.error("Erreur API employees GET:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
