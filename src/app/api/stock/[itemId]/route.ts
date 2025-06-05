"use server";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStockItem } from '@/app/(dashboard)/stock/get-stock';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    if (!itemId) {
		return NextResponse.json({ error: 'ID de l\'employé manquant.' }, { status: 400 });
	}
	
    const item = await getStockItem(itemId);

	if (!item) {
		return NextResponse.json({ error: 'Employé non trouvé.' }, { status: 404 });
	}

    return NextResponse.json({ item });
  } catch (err) {
    // //console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur lors de la récupération des employés.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
	try {
 		const body = await req.json();
		const updated = await prisma.stock.update({
			where: { id: body.id },
			data: {
				[body.field]: parseInt(body.value),
			},
		});

		return NextResponse.json(updated);
	} catch (error) {
		// //console.error(error);
		return NextResponse.json({ errorMessage: 'Échec de la mise à jour', error: error instanceof Error ? error.message : 'Erreur inconnue' }, { status: 500 });
	}
}