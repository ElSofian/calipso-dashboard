"use client";

import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import Table from "@/components/utils/table";
import { toast } from "@/lib/toast";
import { Export } from "@/types";
import {
  getTimeAmount,
  getTimeFrame,
  getTimePercentage,
} from "@/utils/functions";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Exports() {
  const [exportsData, setExportsData] = useState<Export[]>([]);

  const stats = useMemo(() => {
    const weeklyPercentage = getTimePercentage(exportsData, "weekly");
    const monthlyPercentage = getTimePercentage(exportsData, "monthly");
    const dailyAmount = getTimeAmount(exportsData, "daily");
    const weeklyAmount = getTimeAmount(exportsData, "weekly");
    const monthlyAmount = getTimeAmount(exportsData, "monthly");

    return {
      weeklyPercentage,
      monthlyPercentage,
      dailyAmount,
      weeklyAmount,
      monthlyAmount,
    };
  }, [exportsData]);

  const fetchExports = useCallback(async () => {
    try {
			
      const response = await fetch("/api/exports", {
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

      setExportsData(result.exports || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des exports";
      toast.error(errorMessage);
      console.error("Erreur Exports:", err);
    }
  }, []);

  useEffect(() => {
    fetchExports();
  }, [fetchExports]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
          <Card title={getTimeFrame("daily")} value={`${stats.dailyAmount}$`} />

          <Card
            title={getTimeFrame("weekly")}
            value={`${stats.weeklyAmount}$`}
            percentage={stats.weeklyPercentage.toString()}
            iconDirection={stats.weeklyPercentage >= 0 ? "up" : "down"}
            color={
              stats.weeklyPercentage >= 0 ? "text-green-500" : "text-red-500"
            }
          />

          <Card
            title={getTimeFrame("monthly")}
            value={`${stats.monthlyAmount}$`}
            percentage={stats.monthlyPercentage.toString()}
            iconDirection={stats.monthlyPercentage >= 0 ? "up" : "down"}
            color={
              stats.monthlyPercentage >= 0 ? "text-green-500" : "text-red-500"
            }
          />
        </div>

        <div className="flex items-center w-full">
          <Table
            name="Exports"
            columns={[
              { label: "Employé", value: "name" },
              { label: "Montant", value: "amount", end: "$" },
              { label: "Date", value: "date", date: true },
            ]}
            data={exportsData}
            filterCategory="name"
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
