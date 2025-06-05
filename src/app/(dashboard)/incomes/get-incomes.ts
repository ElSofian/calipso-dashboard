import { prisma } from '@/lib/prisma';
import { getAllExports, getExportsFromEmployee } from '../exports/get-exports';
import { getAllSales, getSalesFromEmployee } from '../sales/get-sales';
import { requireAuth } from '@/lib/auth';

export async function getAllIncomes() {
  try {
		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

		const companyId = session.user.company.id;

		const exportsData = await getAllExports();
		const salesData = await getAllSales();

		const pumpsIncomes = await prisma.pumps_incomes.findMany({
			where: {
				pumps: {
					company_id: companyId
				}
			},
			include: {
				pumps: true
			},
			orderBy: {
				date: 'desc'
			},
		});

		const incomesData = [...exportsData, ...salesData, ...pumpsIncomes];

		return incomesData;

  } catch (error) {
		console.error('Erreur dans getAllIncomes:', error);
		throw new Error('Impossible de récupérer les revenus');
  }
}

export async function getIncomesFromEmployee(id: number) {
  try {
		const exportsData = await getExportsFromEmployee(id);
		const salesData = await getSalesFromEmployee(id);

		const incomesData = [...exportsData, ...salesData];

		return incomesData;
  } catch (error) {
    console.error('Erreur dans getExportFromEmployee:', error);
    throw new Error('Impossible de récupérer les exports de l\'employé ' + id);
  }
}
