"use client";

import { useState, useEffect } from "react";
import Card from "@/components/utils/card";
import Table from "@/components/utils/table";
import { getEmployeeTime } from "@/utils/functions";
import { User, Sale, Export } from "@/types";

interface IngameMainProps {
	user: User;
}

export default function IngameMain({ user }: IngameMainProps) {

	const [employeeSales, setEmployeeSales] = useState<Sale[]>([]);
	const [employeeExports, setEmployeeExports] = useState<Export[]>([]);

	useEffect(() => {
		const fetchEmployeeData = async () => {
			try {
				// Récupérer les ventes
				const salesResponse = await fetch(`/api/sales/employee/${user.employee.id}`);
				if (salesResponse.ok) {
					const sales = await salesResponse.json();
					setEmployeeSales(sales);
				}

				// Récupérer les exports
				const exportsResponse = await fetch(`/api/exports/employee/${user.employee.id}`);
				if (exportsResponse.ok) {
					const exportsData = await exportsResponse.json();
					setEmployeeExports(exportsData);
				}
			} catch (error) {
				console.error('Erreur lors de la récupération des données:', error);
			}
		};
		fetchEmployeeData();
	}, [user.employee.id]);

	function getEmployeeSalary(): string {
		const salary = user.employee.salary;
		const sales = employeeSales.reduce((acc, sale) => acc + sale.amount, 0);
		const _exports = employeeExports.reduce((acc, sale) => acc + sale.amount, 0);
		const total = sales + _exports;
		const actualSalary = Number((total * (0.068)).toFixed(0));

		return `${actualSalary.toLocaleString('fr-FR')}/${salary.toLocaleString('fr-FR')}$`
	}

	return (
		<div className="flex flex-col h-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Card
					title="Ventes"
					value={`${employeeSales.reduce((acc, sale) => acc + sale.amount, 0).toLocaleString('fr-FR')}$`}
				/>

				<Card
					title="Exports"
					value={`${employeeExports.reduce((acc, sale) => acc + sale.amount, 0).toLocaleString('fr-FR')}$`}
				/>

				<Card
					title="Salaire"
					value={getEmployeeSalary()}
				/>

				<Card
					title="Temps de service"
					value={getEmployeeTime(user.employee)}
				/>
			</div>

			<div className="flex items-center w-full gap-">
				<Table
					name="Ventes"
					columns={[
						{label: "Client", value: 'client_name', muted: true},
						{label: "Montant", value: 'amount', end: "$"},
						{label: "Raison", value: 'reason'},
						{label: "Statut", value: 'is_paid', badge: { on: "Payé", off: "En attente" }},
						{label: "Date", value: 'date', date: true}
					]}
					data={employeeSales}
					filterCategory="client_name"
				/>
			</div>
		</div>
	);
}