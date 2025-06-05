import { prisma } from '@/lib/prisma';

export async function getAllBuyBackItems() {
  try {
		const buybackItems = await prisma.pawnshop_buyback_items.findMany({
			orderBy: {
				name: 'asc'
			},
		});

		return buybackItems;

  } catch (error) {
		console.error('Erreur dans getAllBuyBackItems:', error);
		throw new Error('Impossible de récupérer les items de rachat');
  }
}