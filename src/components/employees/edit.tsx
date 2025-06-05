import React from 'react';
import ReactDOM from 'react-dom';
import { Employee } from '@/types';

export default function EditEmployee({
	modalIsOpen,
	setModalIsOpen,
	employee,
	setEmployee,
}: {
	modalIsOpen: boolean,
	setModalIsOpen: (isOpen: boolean) => void,
	employee: Employee,
	setEmployee: (employee: Employee | null) => void,
}) {

	if (typeof window === 'undefined') return null;
	
	const handleDeleteEvent = async () => {
		const res = await fetch(`/api/employees`, {
			method: 'DELETE',
			body: JSON.stringify({ id: employee.id }),
		});
		if (res.ok) {
			setModalIsOpen(false);
			setEmployee(null);
		}
	}

	const handleGradeChange = async (status: "up" | "down") => {
		const res = await fetch(`/api/employees`, {
			method: 'PUT',
			body: JSON.stringify({ id: employee.id, status: status }),
		});
		if (res.ok) {
			setModalIsOpen(false);
			setEmployee(null);
		}
	}

	return ReactDOM.createPortal(
		modalIsOpen && (
			<div className="fixed inset-0 flex items-center justify-center z-1000 bg-black/20 backdrop-blur-sm dark:text-white" onClick={() => setModalIsOpen(false)}>
				<div className="relative flex flex-col p-6 bg-gradient-to-t from-gray-50 to-white dark:from-black dark:to-neutral-900 rounded-xl shadow-sm" onClick={(e) => e.stopPropagation()}>
					<h2 className="text-lg font-semibold leading-none tracking-tight pb-1.5">{employee.name}</h2>
					<p className="text-sm text-gray-500 pb-6">{employee.grade}</p>
					<button className="absolute right-4 top-4 rounded-sm opacity-70 focus:outline-none text-black dark:text-white" onClick={() => setModalIsOpen(false)}>
						<i className="fa-light fa-xmark" />
					</button>
					<form className="flex flex-col gap-4">

						<div className="flex flex-row gap-10">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Téléphone</label>
								<p className="text-sm text-gray-500">{employee.phone}</p>
							</div>
							<div className="flex flex-row gap-2">
								<button className="bg-black dark:bg-neutral-800 text-white text-sm px-4 py-0.5 rounded-md w-full cursor-pointer">
									Changer
								</button>
							</div>
						</div>

						<div className="flex flex-row gap-10">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">IBAN</label>
								<p className="text-sm text-gray-500">{employee.iban}</p>
							</div>
							<div className="flex flex-row gap-2">
								<button className="bg-black dark:bg-neutral-800 text-white text-sm px-4 py-0.5 rounded-md w-full cursor-pointer">
									Changer
								</button>
							</div>
						</div>

						<div className="flex flex-row gap-10">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium">Grade</label>
								<p className="text-sm text-gray-500">{employee.grade}</p>
							</div>
							<div className="flex flex-row gap-2">
								<button className="bg-black dark:bg-neutral-800 text-white text-sm px-4 py-0.5 rounded-md w-full cursor-pointer" onClick={() => handleGradeChange("up")}>
									<i className="fa-light fa-chevron-up" />
								</button>
								<button className="bg-black dark:bg-neutral-800 text-white text-sm px-4 py-0.5 rounded-md w-full cursor-pointer" onClick={() => handleGradeChange("down")}>
									<i className="fa-light fa-chevron-down" />
								</button>
							</div>
						</div>

						<button className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-md w-full cursor-pointer" onClick={() => handleDeleteEvent()}>
							Supprimer
						</button>
					</form>
				</div>
			</div>
		),
		document.body
	);
}
