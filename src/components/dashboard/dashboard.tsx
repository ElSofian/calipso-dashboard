"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from "@/components/utils/card";
import Calendar from "@/components/dashboard/calendar";
import { getTimeAmount, getTimePercentage, getEmployeeTime } from '@/utils/functions';
import { Employee, Income, Payment } from '@/types';
import { toast } from '@/lib/toast';

type Data = {
	incomes: Income[];
	payments: Payment[];
	employees: Employee[];
}

function getMostProficientEmployee(employees: Employee[]): Employee {
	const mostProficientEmployee = employees.reduce((prev, current) => {
		return (prev.eotw_count > current.eotw_count) ? prev : current;
	}, employees[0]);
	console.log(mostProficientEmployee);
	return mostProficientEmployee;
}

function getMostPresentEmployee(employees: Employee[]): Employee {
	const mostPresentEmployee = employees.reduce((prev, current) => {
		return (prev.time_in_service > current.time_in_service) ? prev : current;
	}, employees[0]);
	return mostPresentEmployee;
}

export default function Dashboard() {
  
	const [data, setData] = useState<Data>({
		incomes: [],
		payments: [],
		employees: [],
	});
	const [mostProficientEmployee, setMostProficientEmployee] = useState<Employee>({} as Employee);
	const [mostPresentEmployee, setMostPresentEmployee] = useState<Employee>({} as Employee);

	useEffect(() => {
		fetch('/api/dashboard')
			.then(res => res.json())
			.then(data => {
				setData(data)
				setMostProficientEmployee(getMostProficientEmployee(data.employees));
				setMostPresentEmployee(getMostPresentEmployee(data.employees));
			})
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des données du dashboard'));
	}, []);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-6">
				<Card 
					title="Revenus"
					value={getTimeAmount(data.incomes, 'monthly') + "$"}
					percentage={getTimePercentage(data.incomes, 'monthly').toString()}
					description="Revenus mensuels"
					subDescription="Rapporté par les ventes de produits et services"
					iconDirection={getTimePercentage(data.incomes, 'monthly') >= 0 ? 'up' : 'down'}
					color={getTimePercentage(data.incomes, 'monthly') >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card
					title="Dépenses"
					value={getTimeAmount(data.payments, 'monthly') + "$"}
					percentage={getTimePercentage(data.payments, 'monthly').toString()}
					description="Dépenses mensuelles"
					subDescription="Rapporté par les achats de matériel et services"
					iconDirection={getTimePercentage(data.payments, 'monthly') >= 0 ? 'up' : 'down'}
					color={getTimePercentage(data.payments, 'monthly') >= 0 ? 'text-green-500' : 'text-red-500'}
				/>

				<Card
					title="Employé de la semaine"
					value={mostProficientEmployee.name || "Chargement..."}
					description={mostProficientEmployee.eotw_count ? "Élu " + mostProficientEmployee.eotw_count + "x employé de la semaine" : "Chargement..."}
					image={mostProficientEmployee.avatar}
				/>

				<Card
					title="Employé le plus présent"
					value={mostPresentEmployee.name || "Chargement..."}
					description={mostPresentEmployee.name ? getEmployeeTime(mostPresentEmployee) : "Chargement..."}
					image={mostPresentEmployee.avatar}
				/>
			</div>

			<Calendar />

			<div className="flex flex-col gap-6 mb-4 rounded-2xl border border-[var(--border-light)] dark:border-neutral-800">
				<div className="flex flex-col gap-6 p-6 bg-gradient-to-t from-gray-100 to-white rounded-2xl shadow-sm border-[var(--border)] dark:from-black dark:to-neutral-900">
					<h2 className="text-2xl font-semibold dark:text-white">Besoin d&apos;aide ?</h2>
					<p className="text-sm opacity-75 dark:text-white">Rendez-vous sur le <Link href="https://github.com/ElSofian/demo-calipso.git">Repo</Link> pour tout renseignement.</p>
				</div>
			</div>

    </div>
  );
}
