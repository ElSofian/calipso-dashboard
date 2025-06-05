import { NextResponse } from 'next/server';
import { getSalesFromEmployee } from '@/app/(dashboard)/sales/get-sales';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const employeeId = parseInt(id);
    if (isNaN(employeeId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const sales = await getSalesFromEmployee(employeeId);
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des ventes' },
      { status: 500 }
    );
  }
} 