"use server";

import { getDiscordAvatarUrl, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getAllEmployees() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const employees = await prisma.employees.findMany({
			where: {
				company_id: session.user.company.id,
			},
			orderBy: {
				grades: {
					salary: 'desc',
				}
			},
			include: {
				grades: true,
			},
    });

    const employeesWithAvatar = await Promise.all(employees.map(async (emp) => {
			const user = await prisma.user.findUnique({
				where: {
					discord_user_id: emp.user_id,
				},
			});

			if (!user || !user.discord_user_id || !user.discord_avatar_hash) return null;

			return {
				id: emp.id,
				first_name: emp.first_name,
				last_name: emp.last_name,
				name: `${emp.first_name} ${emp.last_name}`,
				grade: emp.grade,
				in_service: emp.in_service,
				salary: emp.grades?.salary ?? 0,
				phone: emp.phone,
				iban: emp.iban,
				eotw_count: emp.eotw_count,
				time_in_service: emp.time_in_service,
				avatar: getDiscordAvatarUrl(user.discord_user_id, user.discord_avatar_hash),
			};
		}));

		return employeesWithAvatar.filter(Boolean);
  } catch (error) {
		console.error('Erreur dans getAllEmployees:', error);
		throw new Error('Impossible de récupérer les employés');
  }
}

export async function getEmployee(id: number) {
  try {
    const employee = await prisma.employees.findUnique({
      where: { id },
      include: {
				grades: true,
			}
    });

    return employee;
  } catch (error) {
    console.error('Erreur dans getEmployee:', error);
    throw new Error('Impossible de récupérer l\'employé ' + id);
  }
}
