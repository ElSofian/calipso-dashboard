import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getAllRuns() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const runs = await prisma.runs.findMany({
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

    return runs.map((run) => ({
      id: run.id,
			employeeId: run.employee_id,
			name: run.employees.first_name + ' ' + run.employees.last_name,
      pump: run.pump,
      amount: run.amount,
      date: run.date,
    }));
  } catch (error) {
		console.error('Erreur dans getAllRuns:', error);
		throw new Error('Impossible de récupérer les runs');
  }
}

export async function getRunsFromEmployee(id: number) {
  try {
    const runs = await prisma.runs.findMany({
      where: { employee_id: id },
			orderBy: {
				date: 'desc',
			},
			include: {
				employees: true,
			},
    });

    return runs.map((run) => ({
      id: run.id,
      employeeId: run.employee_id,
	  	name: run.employees.first_name + ' ' + run.employees.last_name,
      pump: run.pump,
      amount: run.amount,
      date: run.date,
    }));
  } catch (error) {
    console.error('Erreur dans getRunFromEmployee:', error);
    throw new Error('Impossible de récupérer les runs de l\'employé ' + id);
  }
}
