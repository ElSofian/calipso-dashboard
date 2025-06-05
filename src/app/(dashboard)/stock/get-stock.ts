import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getStock() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const stock = await prisma.stock.findMany({
			where: {
				company_id: session.user.company.id,
			},
			orderBy: {
				category: 'asc',
			},
    });

    return stock.map((item) => ({
      id: item.id,
			name: item.name,
			category: item.category,
      price: item.price,
	 	 	cost: item.cost,
      amount_in: item.amount_in,
      amount_ext: item.amount_ext,
			total: item.amount_in + item.amount_ext,
			amount_to_order: item.target - (item.amount_in + item.amount_ext) < 0 ? 0 : item.target - (item.amount_in + item.amount_ext),
      target: item.target,
      promotion: item.promotion,
    }));
  } catch (error) {
		console.error('Erreur dans getStock:', error);
		throw new Error('Impossible de récupérer le stock');
  }
}

export async function getStockItem(name: string) {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');

    const stock = await prisma.stock.findMany({
			where: {
				company_id: session.user.company.id,
				name: name,
			},
			orderBy: {
				category: 'asc',
	  	},
    });

    return stock.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      cost: item.cost,
      amount_in: item.amount_in,
      amount_ext: item.amount_ext,
	  	total: item.amount_in + item.amount_ext,
      target: item.target,
      promotion: item.promotion,
    }));
  } catch (error) {
    console.error('Erreur dans getStockItem:', error);
    throw new Error('Impossible de récupérer les items du stock');
  }
}
