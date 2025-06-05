"use server";

import { NextResponse } from 'next/server';
import { getAllCompanies, getCompany, getCompaniesByCharacterId } from '@/app/(dashboard)/companies/get-companies';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');
		const characterId = searchParams.get('character_id');
		const activeEmployeeId = searchParams.get('active_employee_id');

		if (id) {
			const company = await getCompany(parseInt(id));
			return NextResponse.json({ company });
		}

		if (characterId && activeEmployeeId) {
			const companies = await getCompaniesByCharacterId(parseInt(activeEmployeeId), parseInt(characterId));
			return NextResponse.json({ companies });
		}

    const companies = await getAllCompanies();
    return NextResponse.json({ companies });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des entreprises.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
	try {
		const { user_id, company_id, character_id } = await request.json();

		const employee = await prisma.employees.findFirst({
			where: { company_id: company_id, character_id: character_id }
		});

		if (!employee) {
			return NextResponse.json(
				{ error: 'Employé non trouvé.' },
				{ status: 404 }
			);
		}
		
		await prisma.user.update({
			where: { id: user_id },
			data: {
				active_employee_id: employee.id
			}
		});

		const companies = await getCompaniesByCharacterId(employee.id, employee.character_id);

		return NextResponse.json({ companies });

	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'entreprise.' },
			{ status: 500 }
		);
	}
}