"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/utils/table';
import Card from '@/components/utils/card';
import { getTimeAmount, getTimeFrame, getTimePercentage } from '@/utils/functions';
import { Run } from '@/types';
import { toast } from '@/lib/toast';

export default function Runs() {
	const [runs, setRuns] = useState<Run[]>([]);

	const weeklyPercentage = getTimePercentage(runs, 'weekly');
	const monthlyPercentage = getTimePercentage(runs, 'monthly');

	useEffect(() => {
		fetch('/api/runs')
			.then(res => res.json())
			.then(data => setRuns(data.runs))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des runs'));
	}, []);

  return (
    <div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
				<Card 
					title={getTimeFrame('daily')}
					value={getTimeAmount(runs, 'daily') + "$"}
				/>

				<Card 
					title={getTimeFrame('weekly')}
					value={getTimeAmount(runs, 'weekly') + "$"}
					percentage={weeklyPercentage.toString()}
					iconDirection={weeklyPercentage >= 0 ? 'up' : 'down'}
					color={weeklyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card 
					title={getTimeFrame('monthly')}
					value={getTimeAmount(runs, 'monthly') + "$"}
					percentage={monthlyPercentage.toString()}
					iconDirection={monthlyPercentage >= 0 ? 'up' : 'down'}
					color={monthlyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>
			</div>


			<div className="flex items-center w-full gap-">
				<Table
					name="Runs"
					columns={[
						{label: "Employé", value: "name"},
						{label: "Pompe", value: "pump", muted: true},
						{label: "Quantité", value: "amount", end: "L"},
						{label: "Date", value: "date", date: true},
					]}
					data={runs}
					filterCategory="name"
				/>
			</div>
		</div>
  );
}
