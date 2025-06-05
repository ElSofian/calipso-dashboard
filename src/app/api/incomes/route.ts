"use server";

import { NextResponse } from 'next/server';
import { getAllIncomes } from '@/app/(dashboard)/incomes/get-incomes';

export async function GET() {
  try {
    const incomes = await getAllIncomes();
    return NextResponse.json({ incomes });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des revenus.' },
      { status: 500 }
    );
  }
}
