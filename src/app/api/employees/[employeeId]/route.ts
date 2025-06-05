"use server";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmployee } from '@/app/(dashboard)/employees/get-employees';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    if (!employeeId) {
			return NextResponse.json({ error: 'ID de l\'employé manquant.' }, { status: 400 });
		}
	
    const employee = await getEmployee(parseInt(employeeId));

		if (!employee) {
			return NextResponse.json({ error: 'Employé non trouvé.' }, { status: 404 });
		}

    return NextResponse.json({ employee });
  } catch (error) {
    // //console.error(err);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la récupération des employés.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ employeeId: string }> }) {
	try {
		const { employeeId } = await params;
 		const body = await req.json();
		const updated = await prisma.employees.update({
			where: { id: parseInt(employeeId) },
			data: {
				grade: body.grade,
				phone: body.phone,
				iban: body.iban,
			},
		});

		const res = await fetch(`http://${process.env.IP}:${process.env.BOT_PORT}/update-employee/${body.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': process.env.API_SECRET!,
			},
			body: JSON.stringify(updated),
		});

		const resData = await res.json();

		if (!res.ok) {
			return NextResponse.json({ errorMessage: resData.error || 'Erreur lors de la mise à jour du bot.' }, { status: 500 });
		}

		return NextResponse.json(updated);
	} catch (error) {
		// //console.error(error);
		return NextResponse.json({ errorMessage: 'Échec de la mise à jour', error: error instanceof Error ? error.message : 'Erreur inconnue' }, { status: 500 });
	}
}