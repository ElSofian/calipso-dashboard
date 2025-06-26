"use server";

import { getCompanyFromEmployeeId } from "@/app/(dashboard)/companies/get-companies";
import {
  createVehicle,
  getAllVehicles,
} from "@/app/(dashboard)/garage/get-vehicles";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const vehicles = await getAllVehicles();
    return NextResponse.json({ vehicles });
  } catch (err) {
    console.error("Erreur API garage GET:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des véhicules.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.vehicle_id || !body.model || !body.plate) {
      return NextResponse.json(
        { error: "Données manquantes: vehicle_id, model et plate sont requis" },
        { status: 400 }
      );
    }

    const vehicleId = parseInt(body.vehicle_id);
    if (isNaN(vehicleId) || vehicleId <= 0) {
      return NextResponse.json(
        { error: "L'ID du véhicule doit être un nombre valide et positif" },
        { status: 400 }
      );
    }

    const employee = await prisma.employees.findUnique({
      where: {
        id: session.user.active_employee_id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employé non trouvé" },
        { status: 404 }
      );
    }

    const company = await getCompanyFromEmployeeId(employee.id);

    if (!company) {
      return NextResponse.json(
        { error: "Entreprise non trouvée pour cet employé" },
        { status: 404 }
      );
    }

    const vehicle = await createVehicle({
      company_id: company.id,
      vehicle_id: vehicleId,
      model: body.model,
      plate: body.plate,
    });

    return NextResponse.json({ vehicle });
  } catch (err) {
    console.error("Erreur API garage POST:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la création du véhicule.",
      },
      { status: 500 }
    );
  }
}
