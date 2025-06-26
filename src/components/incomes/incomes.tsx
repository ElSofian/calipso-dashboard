"use client";

import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import { toast } from "@/lib/toast";
import type { Income } from "@/types";
import {
  getChartData,
  getIncomeInsights,
  getLast7DaysData,
  getTimeAmount,
  getTimeFrame,
  getTimePercentage,
} from "@/utils/functions";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
};

export default function Incomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);

  const stats = useMemo(() => {
    const weeklyPercentage = getTimePercentage(incomes, "weekly");
    const monthlyPercentage = getTimePercentage(incomes, "monthly");
    const dailyAmount = getTimeAmount(incomes, "daily");
    const weeklyAmount = getTimeAmount(incomes, "weekly");
    const monthlyAmount = getTimeAmount(incomes, "monthly");
    const chartData = getChartData(incomes);
    const weeklyData = getLast7DaysData(incomes);
    const insights = getIncomeInsights(incomes);

    return {
      weeklyPercentage,
      monthlyPercentage,
      dailyAmount,
      weeklyAmount,
      monthlyAmount,
      chartData,
      weeklyData,
      insights,
    };
  }, [incomes]);

  const fetchIncomes = useCallback(async () => {
    try {

      const response = await fetch("/api/incomes", {
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

      setIncomes(result.incomes || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des revenus";
      toast.error(errorMessage);
      console.error("Erreur Incomes:", err);
    }
  }, []);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const CustomTooltip = useCallback(
    ({ active, payload, label }: TooltipProps) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium dark:text-white">{`${label}`}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {`Revenus: ${payload[0].value.toLocaleString("fr-FR")}$`}
            </p>
          </div>
        );
      }
      return null;
    },
    []
  );


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

        <div className="grid grid-cols-1 lg:grid-cols-11 items-start justify-between gap-6">
          <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 p-6 bg-gradient-to-t from-gray-100 to-white dark:from-black dark:to-neutral-800 dark:border-white rounded-2xl shadow-sm border-[var(--border)]">
            <div className="flex items-center justify-between">
              <p className="text-sm opacity-75 dark:text-white">
                Graphique des revenus
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                  <span>Revenus quotidiens</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <span>Tendance</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.weeklyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "currentColor", opacity: 0.7 }}
                    tickFormatter={(value) => `${value}$`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="h-20 w-full border-t border-gray-200 dark:border-gray-700 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="amount"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 p-6 bg-gradient-to-t from-gray-100 to-white dark:from-black dark:to-neutral-800 dark:border-white rounded-2xl shadow-sm border-[var(--border)]">
            <p className="text-sm opacity-75 dark:text-white">
              Analyse intelligente
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                {stats.insights.trend === "up" ? (
                  <i className="fa-light fa-arrow-trend-up fa-fw fa-sm text-green-500 mt-2" />
                ) : (
                  <i className="fa-light fa-arrow-trend-down fa-fw fa-sm text-red-500 mt-2" />
                )}
                <div>
                  <p className="text-sm font-medium dark:text-white">
                    Tendance
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stats.insights.trendMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <i className="fa-light fa-bullseye fa-fw fa-sm text-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-medium dark:text-white">
                    Performance
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stats.insights.bestPeriod}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <i className="fa-light fa-calendar fa-fw fa-sm text-purple-500 mt-2" />
                <div>
                  <p className="text-sm font-medium dark:text-white">
                    Moyenne quotidienne
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stats.insights.dailyAverage}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <i className="fa-light fa-dollar-sign fa-fw fa-sm text-green-500 mt-2" />
                <div>
                  <p className="text-sm font-medium dark:text-white">
                    Objectif mensuel
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {stats.insights.monthlyGoal}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <i className="fa-light fa-lightbulb fa-fw fa-sm text-blue-500 mt-2.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Recommandation
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {stats.insights.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
