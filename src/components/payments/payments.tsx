"use client";

import React, { useEffect, useState } from 'react';
import Table from '@/components/utils/table';
import Card from '@/components/utils/card';
import { getTimeAmount, getTimeFrame, getTimePercentage } from '@/utils/functions';
import { Payment } from '@/types';
import { toast } from '@/lib/toast';

export default function Payements() {

	const [payments, setPayments] = useState<Payment[]>([]);
	const weeklyPercentage = getTimePercentage(payments, 'weekly');
	const monthlyPercentage = getTimePercentage(payments, 'monthly');

	useEffect(() => {
		fetch('/api/payments')
			.then(res => res.json())
			.then(data => setPayments(data.payments))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des paiements'));
	}, []);

  return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
				<Card 
					title={getTimeFrame('daily')}
					value={getTimeAmount(payments, 'daily') + "$"}
				/>

				<Card 
					title={getTimeFrame('weekly')}
					value={getTimeAmount(payments, 'weekly') + "$"}
					percentage={weeklyPercentage.toString()}
					iconDirection={weeklyPercentage >= 0 ? 'up' : 'down'}
					color={weeklyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card 
					title={getTimeFrame('monthly')}
					value={getTimeAmount(payments, 'monthly') + "$"}
					percentage={monthlyPercentage.toString()}
					iconDirection={monthlyPercentage >= 0 ? 'up' : 'down'}
					color={monthlyPercentage >= 0 ? 'text-green-500' : 'text-red-500'}
				/>
			</div>

			<div className="flex items-center w-full gap-">
				<Table
					name="Paiements"
					columns={[
						{ label: 'Montant', value: 'amount', number: true, end: "$" },
						{ label: 'Raison', value: 'reason' },
						{ label: 'Date', value: 'date', date: true },
					]}
					data={payments}
					filterCategory="name"
				/>
			</div>
		</div>
  );
}
