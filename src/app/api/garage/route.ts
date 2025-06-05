"use server";

import { NextResponse } from 'next/server';
import { getAllVehicles, createVehicle } from '@/app/(dashboard)/garage/get-vehicles';
import { getCompanyFromEmployeeId } from '@/app/(dashboard)/companies/get-companies';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json({ vehicles });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des employés.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		
		const vehicleId = parseInt(body.vehicle_id);
		if (isNaN(vehicleId)) {
			throw new Error('L\'ID du véhicule doit être un nombre valide');
		}
		
		if (!body.model || !body.plate) {
			throw new Error('Le modèle et la plaque sont obligatoires');
		}
		
		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

		const employee = await prisma.employees.findUnique({
			where: {
				id: session.user.active_employee_id,
			},
		});

		if (!employee) throw new Error('Impossible de récupérer l\'employé');
		
		const company = await getCompanyFromEmployeeId(employee.id);

		if (!company) throw new Error('Impossible de récupérer l\'entreprise pour l\'employé ' + employee.id);

		const vehicle = await createVehicle({
			company_id: company.id,
			vehicle_id: vehicleId,
			model: body.model,
			plate: body.plate,
		});
		
		return NextResponse.json({ vehicle });
	} catch (err) {
		return NextResponse.json({ error: err instanceof Error ? err.message : 'Erreur lors de la création du véhicule.' }, { status: 500 });
	}
}