"use server";

import { NextResponse } from 'next/server';
import { getAllNotifications, getNotification } from '@/app/(dashboard)/notifications/notifications';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {

		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (id) {
			const notification = await getNotification(parseInt(id));
			return NextResponse.json({ notification });
		}

    const notifications = await getAllNotifications();
    return NextResponse.json({ notifications });

  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des notifications.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {

	try {
		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

		const { id } = await request.json();

		if (id) {
			const existingRead = await prisma.notifications_reads.findFirst({
				where: {
					notification_id: id,
					employee_id: session.user.active_employee_id
				}
			});

			if (!existingRead) {
				await prisma.notifications_reads.create({
					data: {
						notification_id: id,
						employee_id: session.user.active_employee_id,
						readed: true
					}
				});
			} else if (!existingRead.readed) {
				await prisma.notifications_reads.update({
					where: { id: existingRead.id },
					data: { readed: true }
				});
			}

			return NextResponse.json({ success: true });

		} else {
			const unreadNotifications = await prisma.notifications.findMany({
				where: {
					company_id: session.user.company.id,
					notifications_reads: {
						none: {
							employee_id: session.user.active_employee_id,
							readed: true
						}
					}
				}
			});

			for (const notification of unreadNotifications) {
				const existingRead = await prisma.notifications_reads.findFirst({
					where: {
						notification_id: notification.id,
						employee_id: session.user.active_employee_id
					}
				});

				if (!existingRead) {
					await prisma.notifications_reads.create({
						data: {
							notification_id: notification.id,
							employee_id: session.user.active_employee_id,
							readed: true
						}
					});
				} else {
					await prisma.notifications_reads.update({
						where: { id: existingRead.id },
						data: { readed: true }
					});
				}
			}

			return NextResponse.json({ success: true });
		}

	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la notification.' },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {

	try {

		const { title, message, company_id } = await request.json();

		const notification = await prisma.notifications.create({
			data: {
				company_id,
				title,
				message,
			}
		});

		return NextResponse.json({ notification });
		
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Erreur lors de la création de la notification.' },
			{ status: 500 }
		);
	}
}