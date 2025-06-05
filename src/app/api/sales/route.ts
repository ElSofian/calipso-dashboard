"use server";

import { NextResponse } from 'next/server';
import { getAllSales } from '@/app/(dashboard)/sales/get-sales';

export async function GET() {
  try {
    const sales = await getAllSales();
    return NextResponse.json({ sales });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des ventes.' },
      { status: 500 }
    );
  }
}
