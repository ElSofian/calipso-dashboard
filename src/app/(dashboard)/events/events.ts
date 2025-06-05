"use server";

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getAllEvents() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const events = await prisma.events.findMany({
			where: {
				company_id: session.user.company.id,
			},
		});

    return events.map((event) => ({
      id: event.id,
			title: event.title,
			description: event.description,
			location: event.location,
			start: new Date(event.start),
			end: new Date(event.end),
			start_time: new Date(event.start_time),
			end_time: new Date(event.end_time),
    }));
	} catch (error) {
		console.error('Erreur dans getAllEvents:', error);
		throw new Error('Impossible de récupérer les événements');
	}
}

export async function getEvent(id: number) {
  try {
    const event = await prisma.events.findUnique({
      where: { id },
    });

    return event;
  } catch (error) {
    console.error('Erreur dans getEvent:', error);
    throw new Error('Impossible de récupérer l\'événement ' + id);
  }
}

export async function createEvent(title: string, description: string, location: string, start: Date, end: Date, start_time: Date, end_time: Date) {
	try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

		const formatDateForMySQL = (date: Date) => {
			return new Date(date.toISOString().split('T')[0] + 'T00:00:00.000Z');
		};
		
		const formatTimeForMySQL = (time: Date) => {
			return new Date(
				new Date().toISOString().split('T')[0] + 'T' + 
				time.toISOString().split('T')[1]
			);
		};

		const event = await prisma.events.create({
			data: {
				title,
				description,
				location,
				start: formatDateForMySQL(start),
				end: formatDateForMySQL(end),
				start_time: formatTimeForMySQL(start_time),
				end_time: formatTimeForMySQL(end_time),
				companies: {
					connect: {
						id: session.user.company.id,
					},
				},
			},
		});

		return event;
	} catch (error) {
		console.error('Erreur détaillée dans createEvent:', error);
		throw new Error(`Impossible de créer l'événement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
	}
}

export async function deleteEvent(id: number) {
	try {
		const event = await prisma.events.delete({
			where: { id },
		});
		return event;
	} catch (error) {
		console.error('Erreur dans deleteEvent:', error);
		throw new Error('Impossible de supprimer l\'événement ' + id);
	}
}
