"use client";

import React, { useEffect, useState } from 'react';
import Card from '@/components/utils/card';
import { getTimeAmount, getTimeFrame, getTimePercentage } from '@/utils/functions';
import { Income } from '@/types';
import { toast } from '@/lib/toast';

export default function Incomes() {

	const [incomes, setIncomes] = useState<Income[]>([]);
	const weeklyPercentage = getTimePercentage(incomes, 'weekly');
	const monthlyPercentage = getTimePercentage(incomes, 'monthly');

	useEffect(() => {
		fetch('/api/incomes')
			.then(res => res.json())
			.then(data => setIncomes(data.incomes))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des revenus'));
	}, []);

  return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
				<Card 
					title={getTimeFrame('daily')}
					value={getTimeAmount(incomes, 'daily') + "$"}
				/>

				<Card 
					title={getTimeFrame('weekly')}
					value={getTimeAmount(incomes, 'weekly') + "$"}
					percentage={weeklyPercentage.toString()}
					iconDirection={weeklyPercentage >= 0 ? 'up' : 'down'}
					color={weeklyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card 
					title={getTimeFrame('monthly')}
					value={getTimeAmount(incomes, 'monthly') + "$"}
					percentage={monthlyPercentage.toString()}
					iconDirection={monthlyPercentage >= 0 ? 'up' : 'down'}
					color={monthlyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>
			</div>


			<div className="grid grid-cols-11 items-center justify-between gap-6">
				<div className="col-span-7 flex flex-col gap-6 p-6 bg-gradient-to-t from-gray-100 to-white dark:from-black dark:to-neutral-800 dark:border-white rounded-2xl shadow-sm border-[var(--border)]">
					<p className="text-sm opacity-75 dark:text-white">Graphique des revenus</p>
				</div>

				<div className="col-span-4 flex flex-col gap-6 p-6 bg-gradient-to-t from-gray-100 to-white dark:from-black dark:to-neutral-800 dark:border-white rounded-2xl shadow-sm border-[var(--border)]">
					<p className="text-sm opacity-75 dark:text-white">Analyse intelligente</p>
				</div>
			</div>
		</div>
  );
}
