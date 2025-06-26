"use server";

import {
  getAllCompanies,
  getCompaniesByCharacterId,
  getCompany,
} from "@/app/(dashboard)/companies/get-companies";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const characterId = searchParams.get("character_id");
    const activeEmployeeId = searchParams.get("active_employee_id");

    // Validation des paramètres
    if (id && (isNaN(parseInt(id)) || parseInt(id) <= 0)) {
      return NextResponse.json(
        { error: "ID d'entreprise invalide" },
        { status: 400 }
      );
    }

    if (
      characterId &&
      (isNaN(parseInt(characterId)) || parseInt(characterId) <= 0)
    ) {
      return NextResponse.json(
        { error: "ID de personnage invalide" },
        { status: 400 }
      );
    }

    if (
      activeEmployeeId &&
      (isNaN(parseInt(activeEmployeeId)) || parseInt(activeEmployeeId) <= 0)
    ) {
      return NextResponse.json(
        { error: "ID d'employé actif invalide" },
        { status: 400 }
      );
    }

    if (id) {
      const company = await getCompany(parseInt(id));
      return NextResponse.json({ company });
    }

    if (characterId && activeEmployeeId) {
      const companies = await getCompaniesByCharacterId(
        parseInt(activeEmployeeId),
        parseInt(characterId)
      );
      return NextResponse.json({ companies });
    }

    const companies = await getAllCompanies();
    return NextResponse.json({ companies });
  } catch (err) {
    console.error("Erreur API companies GET:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des entreprises.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { user_id, company_id, character_id } = body;

    // Validation des données d'entrée
    if (!user_id || !company_id || !character_id) {
      return NextResponse.json(
        {
          error:
            "Données manquantes: user_id, company_id et character_id sont requis",
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(company_id)) || parseInt(company_id) <= 0) {
      return NextResponse.json(
        { error: "ID d'entreprise invalide" },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(character_id)) || parseInt(character_id) <= 0) {
      return NextResponse.json(
        { error: "ID de personnage invalide" },
        { status: 400 }
      );
    }

    // Vérification que l'utilisateur peut modifier cette donnée
    if (session.user.id !== user_id) {
      return NextResponse.json(
        { error: "Non autorisé à modifier cet utilisateur" },
        { status: 403 }
      );
    }

    const employee = await prisma.employees.findFirst({
      where: {
        company_id: parseInt(company_id),
        character_id: parseInt(character_id),
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employé non trouvé." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: user_id },
      data: {
        active_employee_id: employee.id,
      },
    });

    const companies = await getCompaniesByCharacterId(
      employee.id,
      employee.character_id
    );

    return NextResponse.json({ companies });
  } catch (err) {
    console.error("Erreur API companies PUT:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de l'entreprise.",
      },
      { status: 500 }
    );
  }
}
