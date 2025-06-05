"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/stock/table';
import Card from '@/components/utils/card';
import { Stock as StockType } from '@/types';
import { toast } from '@/lib/toast';

export default function Stock() {

	const [stock, setStock] = useState<StockType[]>([]);

	useEffect(() => {
		fetch('/api/stock')
			.then(res => res.json())
			.then(data => setStock(data.stock))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération du stock'));
	}, []);

  return (
    <div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
				<Card 
					title="Items"
					value={stock.length.toString()}
				/>

				<Card 
					title="Total d'items"
					value={stock.reduce((acc, item) => acc + item.total, 0) + "$"}
				/>

				<Card 
					title="Valeur du stock"
					value={stock.reduce((acc, item) => acc + (item.total * item.price), 0) + "$"}
				/>
			</div>


			<div className="flex items-center w-full gap-">
				<Table stock={stock} />
			</div>
		</div>
  );
}
