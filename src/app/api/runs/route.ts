"use server";

import { NextResponse } from 'next/server';
import { getAllRuns } from '@/app/(dashboard)/runs/get-runs';

export async function GET() {
  try {
    const runs = await getAllRuns();
    return NextResponse.json({ runs });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des runs.' },
      { status: 500 }
    );
  }
}
