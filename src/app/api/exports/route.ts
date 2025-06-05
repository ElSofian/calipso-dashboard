"use server";

import { NextResponse } from 'next/server';
import { getAllExports } from '@/app/(dashboard)/exports/get-exports';

export async function GET() {
  try {
    const exports = await getAllExports();
    return NextResponse.json({ exports });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des exportations.' },
      { status: 500 }
    );
  }
}
