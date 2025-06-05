"use server";

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getAllPayments() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const payments = await prisma.payments.findMany({
			where: {
				company_id: session.user.company.id,
			},
			orderBy: {
				date: 'desc'
			}
		});

    return payments.map((payment) => ({
      id: payment.id,
			amount: payment.amount,
			reason: payment.reason,
			date: payment.date,
    }));
  } catch (error) {
    console.error('Erreur dans getAllPayments:', error);
    throw new Error('Impossible de récupérer les paiements');
  }
}

export async function getPayment(id: number) {
  try {
    const payment = await prisma.payments.findUnique({
      where: { id },
    });

    return payment;
  } catch (error) {
    console.error('Erreur dans getPayment:', error);
    throw new Error('Impossible de récupérer le paiement ' + id);
  }
}
