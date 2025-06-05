"use server";

import { NextResponse } from 'next/server';
import { getAllPayments } from '@/app/(dashboard)/payments/get-payments';

export async function GET() {
  try {
    const payments = await getAllPayments();
    return NextResponse.json({ payments });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des paiements.' },
      { status: 500 }
    );
  }
}
