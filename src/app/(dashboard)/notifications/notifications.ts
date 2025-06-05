"use server";

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getAllNotifications() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const notifications = await prisma.notifications.findMany({
			where: {
				company_id: session.user.company.id,
			},
			orderBy: {
				date: 'desc'
			},
			include: {
				notifications_reads: {
					where: {
						employee_id: session.user.active_employee_id,
						readed: true
					}
				}
			}
		});

    return notifications.map((notification) => ({
      id: notification.id,
			company_id: notification.company_id,
			title: notification.title,
			message: notification.message,
			readed: notification.notifications_reads.length > 0, // L'employé a lu si une entrée existe avec readed = true
			date: notification.date,
    }));
  } catch (error) {
    console.error('Erreur dans getAllNotifications:', error);
    throw new Error('Impossible de récupérer les notifications');
  }
}

export async function getNotification(id: number) {
  try {
    const notification = await prisma.notifications.findUnique({
      where: { id },
    });

    return notification;
  } catch (error) {
    console.error('Erreur dans getNotification:', error);
    throw new Error('Impossible de récupérer la notification ' + id);
  }
}
