"use server";

import { getAllEmployees } from "@/app/(dashboard)/employees/get-employees";
import { getAllIncomes } from "@/app/(dashboard)/incomes/get-incomes";
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

    const incomes = await getAllIncomes();
    const payments = await getAllPayments();
    const employees = await getAllEmployees();

    return NextResponse.json({ incomes, payments, employees });
  } catch (err) {
    console.error("Erreur API dashboard GET:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des données.",
      },
      { status: 500 }
    );
  }
}
