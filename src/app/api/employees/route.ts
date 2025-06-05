"use server";

import { NextResponse } from "next/server";
import { getAllEmployees } from "@/app/(dashboard)/employees/get-employees";

export async function GET() {
  try {
    const employees = await getAllEmployees();
    return NextResponse.json({ employees });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
