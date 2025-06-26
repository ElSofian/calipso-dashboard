"use client";

import Table from "@/components/stock/table";
import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import { toast } from "@/lib/toast";
import { Stock as StockType } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Stock() {
  const [stock, setStock] = useState<StockType[]>([]);

  const stats = useMemo(() => {
    const totalItems = stock.length;
    const totalQuantity = stock.reduce(
      (acc, item) => acc + (item.total || 0),
      0
    );
    const totalValue = stock.reduce(
      (acc, item) => acc + (item.total || 0) * (item.price || 0),
      0
    );

    return {
      totalItems,
      totalQuantity,
      totalValue,
    };
  }, [stock]);

  const fetchStock = useCallback(async () => {
    try {

      const response = await fetch("/api/stock", {
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

      setStock(result.stock || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération du stock";
      toast.error(errorMessage);
      console.error("Erreur Stock:", err);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
          <Card
            title="Articles"
            value={stats.totalItems.toLocaleString()}
          />

          <Card
            title="Quantité totale"
            value={stats.totalQuantity.toLocaleString()}
          />

          <Card
            title="Valeur du stock"
            value={`${stats.totalValue.toLocaleString()}$`}
          />
        </div>

        <div className="flex items-center w-full">
          <Table stock={stock} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
