"use server";

import { prisma } from '@/lib/prisma';
import { Company } from '@/types';

export async function getAllCompanies() {
  try {
    const companies = await prisma.companies.findMany();

    return companies.map((company) => ({
      id: company.id,
			name: company.name,
			type: company.type,
			logo: company.logo,
			eotw: company.eotw,
			created_at: company.created_at,
    }));
  } catch (error) {
    console.error('Erreur dans getAllCompanies:', error);
    throw new Error('Impossible de récupérer les entreprises');
  }
}

export async function getCompany(id: number): Promise<Company | null> {
  try {
    const company = await prisma.companies.findUnique({
      where: { id },
    });

    return company as Company | null;
  } catch (error) {
    console.error('Erreur dans getCompany:', error);
    throw new Error('Impossible de récupérer l\'entreprise ' + id);
  }
}

export async function getCompaniesByCharacterId(activeEmployeeId: number, character_id: number) {
	try {
		const companiesData = await prisma.companies.findMany({
			where: { employees: { some: { character_id } } },
		});

		const companies = companiesData.map((company) => ({
			id: company.id,
			name: company.name,
			type: company.type,
			logo: company.logo,
			eotw: company.eotw,
			active: false,
			created_at: company.created_at,
		}));

		const activeEmployee = await prisma.employees.findUnique({
			where: { id: activeEmployeeId },
			include: { companies: true }
		});

		//console.log(activeEmployee);

		companies.forEach((company) => {
			company.active = company.id === activeEmployee?.company_id;
		});

		//console.log(companies);

		return companies;
	} catch (error) {
		console.error('Erreur dans getCompaniesByCharacterId:', error);
		throw new Error('Impossible de récupérer les entreprises pour le personnage ' + character_id);
	}
}

export async function getCompanyFromEmployeeId(employeeId: number) {
	try {
		const employee = await prisma.employees.findFirst({
			where: { id: employeeId },
		});

		const company = await prisma.companies.findUnique({
			where: { id: employee?.company_id },
		});

		return company;
	} catch (error) {
		console.error('Erreur dans getCompanyFromEmployeeId:', error);
		throw new Error('Impossible de récupérer l\'entreprise pour l\'employé ' + employeeId);
	}
}
