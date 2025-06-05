"use client";

import React, { useState, useEffect } from 'react';
import Table from '@/components/utils/table';
import Card from '@/components/utils/card';
import CreateVehicleModal from '@/components/garage/create-vehicle';
import { Vehicle } from '@/types';
import { toast } from '@/lib/toast';

export default function Garage() {

	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		fetch('/api/garage')
			.then(res => res.json())
			.then(data => setVehicles(data.vehicles))
			.catch(err => toast.error(err?.message || 'Une erreur est survenue lors de la récupération des véhicules'));
	}, []);

	const button = (
		<button className="flex items-center gap-2 bg-black text-white rounded-md px-2.5 py-0.5 cursor-pointer dark:border dark:border-neutral-800" onClick={() => setModalIsOpen(true)}>
			<i className="fa-light fa-plus" />
				Ajouter
			</button>
	)

	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-6">
				<Card 
					title="Total de véhicules"
					value={vehicles.length.toString()}
				/>

				<Card 
					title="Véhicules sortis"
					value={vehicles.filter(v => v.employee_id).length.toString()}
					countCircle={true}
				/>
			</div>

			<div className="flex items-center w-full gap-">
				<Table
					name="Véhicules"
					columns={[
						{label: "ID", value: "vehicle_id"},
						{label: "Modèle", value: "model", muted: true},
						{label: "Conducteur", value: "name"},
						{label: "Plaque", value: "plate", muted: true},
					]}
					data={vehicles}
					filterCategory={['vehicle_id', 'plate', 'model']}
					button={button}
				/>
			</div>

			<CreateVehicleModal
				modalIsOpen={modalIsOpen}
				setModalIsOpen={setModalIsOpen}
				isSaving={isSaving}
				setIsSaving={setIsSaving}
			/>
		</div>
	);
}
