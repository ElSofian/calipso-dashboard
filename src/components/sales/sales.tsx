"use client";

import React, { useEffect, useState } from 'react';
import Table from '@/components/utils/table';
import Card from '@/components/utils/card';
import { getTimeAmount, getTimeFrame, getTimePercentage } from '@/utils/functions';
import { Sale } from '@/types';
import { toast } from '@/lib/toast';

export default function Sales() {

	const [sales, setSales] = useState<Sale[]>([]);
	const weeklyPercentage = getTimePercentage(sales, 'weekly');
	const monthlyPercentage = getTimePercentage(sales, 'monthly');

	useEffect(() => {
		fetch('/api/sales')
			.then(res => res.json())
			.then(data => setSales(data.sales))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des ventes'));
	}, []);

  return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
				<Card 
					title={getTimeFrame('daily')}
					value={getTimeAmount(sales, 'daily') + "$"}
				/>

				<Card 
					title={getTimeFrame('weekly')}
					value={getTimeAmount(sales, 'weekly') + "$"}
					percentage={weeklyPercentage.toString()}
					iconDirection={weeklyPercentage >= 0 ? 'up' : 'down'}
					color={weeklyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card 
					title={getTimeFrame('monthly')}
					value={getTimeAmount(sales, 'monthly') + "$"}
					percentage={monthlyPercentage.toString()}
					iconDirection={monthlyPercentage >= 0 ? 'up' : 'down'}
					color={monthlyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>
			</div>


			<div className="flex items-center w-full gap-">
				<Table
					name="Ventes"
					columns={[
						{label: "Employé", value: 'name'},
						{label: "Client", value: 'client_name', muted: true},
						{label: "Montant", value: 'amount', end: "$"},
						{label: "Raison", value: 'reason'},
						{label: "Statut", value: 'is_paid', badge: { on: "Payé", off: "En attente" }},
						{label: "Date", value: 'date', date: true}
					]}
					data={sales}
					filterCategory="client_name"
				/>
			</div>
		</div>
  );
}
