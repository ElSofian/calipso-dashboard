"use server";

import { NextResponse } from 'next/server';
import { getStock } from '@/app/(dashboard)/stock/get-stock';

export async function GET() {
  try {
    const stock = await getStock();
    return NextResponse.json({ stock });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération du stock.' },
      { status: 500 }
    );
  }
}
