"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/utils/table';
import Card from '@/components/utils/card';
import { Employee, Export, Vehicle, Income, Payment, Run, Sale, Stock } from '@/types';
import { toast } from '@/lib/toast';
import EditEmployee from '@/components/employees/edit';

type Data = Employee | Export | Vehicle | Income | Payment | Run | Sale | Stock;

export default function Employees() {

	const [employees, setEmployees] = useState<Employee[]>([]);
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [modalIsOpen, setModalIsOpen] = useState(false);

	useEffect(() => {
		fetch('/api/employees')
			.then(res => res.json())
			.then(data => setEmployees(data.employees))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des employés'));
	}, []);

	const handleEmployeeClick = (employee: Data) => {
		setSelectedEmployee(employee as Employee);
		setModalIsOpen(true);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-6">
				<Card 
					title="Total d'employés"
					value={employees.length.toString()}
				/>

				<Card 
					title="Employés en service"
					value={employees.filter(e => e.in_service).length.toString()}
					countCircle={true}
				/>
			</div>

			<div className="flex items-center w-full gap-">
				<Table
					name="Employés"
					columns={[
						{label: "Nom", value: "name"},
						{label: "Statut", value: "in_service", badge: { on: "En service", off: "Hors service" }},
						{label: "Grade", value: "grade", muted: true},
						{label: "Salaire", value: "salary", end: "$", number: true, muted: true},
						{label: "Téléphone", value: "phone"},
						{label: "IBAN", value: "iban"},
					]}
					data={employees}
					filterCategory={['first_name', 'last_name', 'character_id', 'id']}
					onClick={handleEmployeeClick}
				/>
			</div>

			{selectedEmployee && (
				<EditEmployee
					modalIsOpen={modalIsOpen}
					setModalIsOpen={setModalIsOpen}
					employee={selectedEmployee}
					setEmployee={setSelectedEmployee}
				/>
			)}
		</div>
	);
}
