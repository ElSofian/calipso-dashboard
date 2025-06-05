"use server";

import { NextResponse } from 'next/server';
import { getAllIncomes } from '@/app/(dashboard)/incomes/get-incomes';
import { getAllPayments } from '@/app/(dashboard)/payments/get-payments';
import { getAllEmployees } from '@/app/(dashboard)/employees/get-employees';

export async function GET() {
  try {
    const incomes = await getAllIncomes();
		const payments = await getAllPayments();
		const employees = await getAllEmployees();

		
		
    return NextResponse.json({ incomes, payments, employees });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des données.' },
      { status: 500 }
    );
  }
}
