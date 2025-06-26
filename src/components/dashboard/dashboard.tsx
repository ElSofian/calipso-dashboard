"use client";

import Calendar from "@/components/dashboard/calendar";
import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import { toast } from "@/lib/toast";
import { Employee, Income, Payment } from "@/types";
import {
  getEmployeeTime,
  getTimeAmount,
  getTimePercentage,
} from "@/utils/functions";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Data = {
  incomes: Income[];
  payments: Payment[];
  employees: Employee[];
};

function getMostProficientEmployee(employees: Employee[]): Employee | null {
  if (!employees.length) return null;
  return employees.reduce((prev, current) => {
    return prev.eotw_count > current.eotw_count ? prev : current;
  });
}

function getMostPresentEmployee(employees: Employee[]): Employee | null {
  if (!employees.length) return null;
  return employees.reduce((prev, current) => {
    return prev.time_in_service > current.time_in_service ? prev : current;
  });
}

export default function Dashboard() {
  const [data, setData] = useState<Data>({
    incomes: [],
    payments: [],
    employees: [],
  });

  const stats = useMemo(() => {
    const monthlyIncomes = getTimeAmount(data.incomes, "monthly");
    const monthlyPayments = getTimeAmount(data.payments, "monthly");
    const incomePercentage = getTimePercentage(data.incomes, "monthly");
    const paymentPercentage = getTimePercentage(data.payments, "monthly");
    const mostProficientEmployee = getMostProficientEmployee(data.employees);
    const mostPresentEmployee = getMostPresentEmployee(data.employees);

    return {
      monthlyIncomes,
      monthlyPayments,
      incomePercentage,
      paymentPercentage,
      mostProficientEmployee,
      mostPresentEmployee,
    };
  }, [data.incomes, data.payments, data.employees]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        }
        if (response.status === 403) {
          throw new Error("Accès non autorisé.");
        }
        throw new Error(`Erreur serveur (${response.status})`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des données du dashboard";
      toast.error(errorMessage);
      console.error("Erreur Dashboard:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-6">
          <Card
            title="Revenus"
            value={`${stats.monthlyIncomes}$`}
            percentage={stats.incomePercentage.toString()}
            description="Revenus mensuels"
            subDescription="Rapporté par les ventes de produits et services"
            iconDirection={stats.incomePercentage >= 0 ? "up" : "down"}
            color={
              stats.incomePercentage >= 0 ? "text-green-500" : "text-red-500"
            }
          />

          <Card
            title="Dépenses"
            value={`${stats.monthlyPayments}$`}
            percentage={stats.paymentPercentage.toString()}
            description="Dépenses mensuelles"
            subDescription="Rapporté par les achats de matériel et services"
            iconDirection={stats.paymentPercentage >= 0 ? "up" : "down"}
            color={
              stats.paymentPercentage >= 0 ? "text-green-500" : "text-red-500"
            }
          />

          <Card
            title="Employé de la semaine"
            value={stats.mostProficientEmployee?.name || "Aucun employé"}
            description={
              stats.mostProficientEmployee?.eotw_count
                ? `Élu ${stats.mostProficientEmployee.eotw_count}x employé de la semaine`
                : "Aucune nomination"
            }
            image={stats.mostProficientEmployee?.avatar}
          />

          <Card
            title="Employé le plus présent"
            value={stats.mostPresentEmployee?.name || "Aucun employé"}
            description={
              stats.mostPresentEmployee
                ? getEmployeeTime(stats.mostPresentEmployee)
                : "Aucune donnée de présence"
            }
            image={stats.mostPresentEmployee?.avatar}
          />
        </div>

        <Calendar />

        <div className="flex flex-col gap-6 mb-4 rounded-2xl border border-[var(--border-light)] dark:border-neutral-800">
          <div className="flex flex-col gap-6 p-6 bg-gradient-to-t from-gray-100 to-white rounded-2xl shadow-sm border-[var(--border)] dark:from-black dark:to-neutral-900">
            <h2 className="text-2xl font-semibold dark:text-white">
              Besoin d&apos;aide ?
            </h2>
            <p className="text-sm opacity-75 dark:text-white">
              Contactez-nous sur notre{" "}
              <Link
                href="https://discord.gg/"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                Intranet
              </Link>{" "}
              pour toute question ou demande de service.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
