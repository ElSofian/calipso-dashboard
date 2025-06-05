import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Export } from '@/types';

export async function getAllExports() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const exportsData = await prisma.exports.findMany({
			where: {
				company_id: session.user.company.id,
			},
			orderBy: {
				date: 'desc',
			},
			include: {
				employees: true,
			},
    });

    return exportsData.map((e) => ({
      id: e.id,
      employee_id: e.employee_id || 0,
	  	name: e.employees?.first_name + ' ' + e.employees?.last_name,
      amount: e.amount,
      date: e.date,
    }));
  } catch (error) {
		console.error('Erreur dans getAllExports:', error);
		throw new Error('Impossible de récupérer les exports');
  }
}

export async function getExportsFromEmployee(id: number): Promise<Export[]> {
  try {
    const exportsData = await prisma.exports.findMany({
      where: { employee_id: id },
			orderBy: {
				date: 'desc',
			},
			include: {
				employees: true,
			},
    });

    return exportsData.map((e) => ({
      id: e.id,
      employee_id: e.employee_id || 0,
	  	name: e.employees?.first_name + ' ' + e.employees?.last_name,
      amount: e.amount,
      date: e.date,
    }));
  } catch (error) {
    console.error('Erreur dans getExportFromEmployee:', error);
    throw new Error('Impossible de récupérer les exports de l\'employé ' + id);
  }
}