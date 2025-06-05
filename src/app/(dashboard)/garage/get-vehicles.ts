"use server";

import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getAllVehicles() {
  try {

		const session = await requireAuth();
		if (!session || !session.user) throw new Error('Impossible de récupérer la session ou son utilisateur');
		
    const vehicles = await prisma.garage.findMany({
			where: {
				company_id: session.user.company.id,
			},
			include: {
        employees: true,
      },
    });

    return vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehicle_id: vehicle.vehicle_id,
      employee_id: vehicle.employee_id,
      plate: vehicle.plate,
      model: vehicle.model,
      name: vehicle.employees ? `${vehicle.employees.first_name} ${vehicle.employees.last_name}` : 'Au garage'
    }));
  } catch (error) {
    console.error('Erreur dans getAllVehicles:', error);
    throw new Error('Impossible de récupérer les véhicules');
  }
}

export async function getEmployee(id: number) {
  try {
    const vehicle = await prisma.garage.findUnique({
      where: { id },
    });

    return vehicle;
  } catch (error) {
    console.error('Erreur dans getEmployee:', error);
    throw new Error('Impossible de récupérer l\'employé ' + id);
  }
}

export async function createVehicle(data: { company_id: number, vehicle_id: number, model: string, plate: string }) {
	try {
		const newVehicle = await prisma.garage.create({
			data: {
				vehicle_id: data.vehicle_id,
				model: data.model,
				plate: data.plate,
				companies: {
					connect: { id: data.company_id }
				}
			},
		});

		return newVehicle;
	} catch (error) {
		console.error('Erreur dans createVehicle:', error);
		throw new Error('Impossible de créer le véhicule');
	}
}
