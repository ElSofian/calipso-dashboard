"use client";

import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import Table from "@/components/utils/table";
import { toast } from "@/lib/toast";
import { Run } from "@/types";
import {
  getTimeAmount,
  getTimeFrame,
  getTimePercentage,
} from "@/utils/functions";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Runs() {
  const [runs, setRuns] = useState<Run[]>([]);

  const stats = useMemo(() => {
    const weeklyPercentage = getTimePercentage(runs, "weekly");
    const monthlyPercentage = getTimePercentage(runs, "monthly");
    const dailyAmount = getTimeAmount(runs, "daily");
    const weeklyAmount = getTimeAmount(runs, "weekly");
    const monthlyAmount = getTimeAmount(runs, "monthly");

    return {
      weeklyPercentage,
      monthlyPercentage,
      dailyAmount,
      weeklyAmount,
      monthlyAmount,
    };
  }, [runs]);

  const fetchRuns = useCallback(async () => {
    try {

      const response = await fetch("/api/runs", {
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

      setRuns(result.runs || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des runs";
      toast.error(errorMessage);
      console.error("Erreur Runs:", err);
    }
  }, []);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);


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
            name="Runs"
            columns={[
              { label: "Employé", value: "name" },
              { label: "Pompe", value: "pump", muted: true },
              { label: "Quantité", value: "amount", end: "L" },
              { label: "Date", value: "date", date: true },
            ]}
            data={runs}
            filterCategory="name"
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
