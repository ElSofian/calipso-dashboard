"use client";

import CreateVehicle from "@/components/garage/create-vehicle";
import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import Table from "@/components/utils/table";
import { toast } from "@/lib/toast";
import { Vehicle } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Garage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => !v.employee_id).length;
    const assignedVehicles = vehicles.filter((v) => v.employee_id).length;

    return {
      totalVehicles,
      availableVehicles,
      assignedVehicles,
    };
  }, [vehicles]);

  const fetchVehicles = useCallback(async () => {
    try {

      const response = await fetch("/api/garage", {
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

      setVehicles(result.vehicles || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des véhicules";
      toast.error(errorMessage);
      console.error("Erreur Garage:", err);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleCreateVehicle = useCallback(() => {
    setCreateModalIsOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setCreateModalIsOpen(false);
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-between gap-6">
          <Card title="Total" value={stats.totalVehicles.toString()} />

          <Card
            title="Véhicules disponibles"
            value={stats.availableVehicles.toString()}
            color="text-green-500"
          />

          <Card
            title="Véhicules sortis"
            value={stats.assignedVehicles.toString()}
            color="text-blue-500"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Table
            name="Véhicules"
            columns={[
              { label: "ID", value: "vehicle_id" },
              { label: "Modèle", value: "model", muted: true },
              { label: "Conducteur", value: "name" },
              { label: "Plaque", value: "plate", muted: true },
            ]}
            data={vehicles}
            filterCategory={["model", "plate", "employee_name"]}
            button={
              <button
                onClick={handleCreateVehicle}
                className="px-2 py-1 bg-neutral-800 text-white rounded-md shadow-md"
              >
                Ajouter un véhicule
              </button>
            }
          />
        </div>

        {createModalIsOpen && (
          <CreateVehicle
            modalIsOpen={createModalIsOpen}
            setModalIsOpen={setCreateModalIsOpen}
            isSaving={false}
            setIsSaving={() => {}}
            onSuccess={handleModalClose}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
