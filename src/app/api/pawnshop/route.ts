"use server";

import { NextResponse } from 'next/server';
import { getAllBuyBackItems } from '@/app/(dashboard)/pawnshop/get-buyback-items';

export async function GET() {
  try {
    const buybackItems = await getAllBuyBackItems();
    return NextResponse.json({ buybackItems });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des items de rachat.' },
      { status: 500 }
    );
  }
}
