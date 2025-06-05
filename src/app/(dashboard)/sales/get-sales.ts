"use server";

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Sale } from '@/types';

export async function getAllSales() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const sales = await prisma.bills.findMany({
			where: {
				company_id: session.user.company.id,
			},
			orderBy: {	
				date: 'desc'
			},
			include: {
				employees: true,
			},
		});

    return sales.map((sale) => ({
      id: sale.id,
			client_name: sale.client_name,
			client_character_id: sale.client_character_id,
			amount: sale.amount,
			reason: sale.reason,
			date: sale.date,
			is_paid: sale.is_paid,
			name: sale.employees ? `${sale.employees.first_name} ${sale.employees.last_name}` : null
    }));
  } catch (error) {
    console.error('Erreur dans getAllSales:', error);
    throw new Error('Impossible de récupérer les ventes');
  }
}

export async function getSale(id: number) {
  try {
    const sale = await prisma.bills.findUnique({
      where: { id },
    });

    return sale;
  } catch (error) {
    console.error('Erreur dans getSale:', error);
    throw new Error('Impossible de récupérer la vente ' + id);
  }
}

export async function getSalesFromEmployee(id: number): Promise<Sale[]> {
	try {
		const sales = await prisma.bills.findMany({
			where: { employee_id: id },
			include: {
				employees: true,
			},
		});

		return sales.map((sale) => ({
			id: sale.id,
			client_name: sale.client_name,
			client_character_id: sale.client_character_id,
			amount: sale.amount,
			reason: sale.reason,
			date: sale.date,
			is_paid: sale.is_paid,
			employee: sale.employees ? {
				first_name: sale.employees.first_name,
				last_name: sale.employees.last_name
			} : null
		}));
	} catch (error) {
		console.error('Erreur dans getSalesFromEmployee:', error);
		throw new Error('Impossible de récupérer les ventes de l\'employé ' + id);
	}
}