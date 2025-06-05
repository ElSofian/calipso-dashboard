"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/utils/table';
import Card from '@/components/utils/card';
import { getTimeAmount, getTimeFrame, getTimePercentage } from '@/utils/functions';
import { Export } from '@/types';
import { toast } from '@/lib/toast';

export default function Exports() {
	const [exportsData, setExportsData] = useState<Export[]>([]);

	const weeklyPercentage = getTimePercentage(exportsData, 'weekly');
	const monthlyPercentage = getTimePercentage(exportsData, 'monthly');

	useEffect(() => {
		fetch('/api/exports')
			.then(res => res.json())
			.then(data => setExportsData(data.exports))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des exports'));
	}, []);

  return (
    <div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
				<Card 
					title={getTimeFrame('daily')}
					value={getTimeAmount(exportsData, 'daily') + "$"}
				/>

				<Card 
					title={getTimeFrame('weekly')}
					value={getTimeAmount(exportsData, 'weekly') + "$"}
					percentage={weeklyPercentage.toString()}
					iconDirection={weeklyPercentage >= 0 ? 'up' : 'down'}
					color={weeklyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card 
					title={getTimeFrame('monthly')}
					value={getTimeAmount(exportsData, 'monthly') + "$"}
					percentage={monthlyPercentage.toString()}
					iconDirection={monthlyPercentage >= 0 ? 'up' : 'down'}
					color={monthlyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>
			</div>


			<div className="flex items-center w-full gap-">
				<Table
					name="Exports"
					columns={[
						{label: "Employé", value: "name"},
						{label: "Montant", value: "amount", end: "$"},
						{label: "Date", value: "date", date: true},
					]}
					data={exportsData}
					filterCategory="name"
				/>
			</div>
		</div>
  );
}
