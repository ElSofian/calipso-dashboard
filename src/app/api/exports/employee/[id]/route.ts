import { NextResponse } from 'next/server';
import { getExportsFromEmployee } from '@/app/(dashboard)/exports/get-exports';

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

    const exportsData = await getExportsFromEmployee(employeeId);
    return NextResponse.json(exportsData);
  } catch (error) {
    console.error('Erreur lors de la récupération des exports:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des exports' },
      { status: 500 }
    );
  }
} 