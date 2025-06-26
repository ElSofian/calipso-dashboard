"use client";

import EditEmployee from "@/components/employees/edit";
import Card from "@/components/utils/card";
import { ErrorBoundary } from "@/components/utils/error-boundary";
import Table from "@/components/utils/table";
import { toast } from "@/lib/toast";
import {
  Employee,
  Export,
  Income,
  Payment,
  Run,
  Sale,
  Stock,
  Vehicle,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

type Data = Employee | Export | Vehicle | Income | Payment | Run | Sale | Stock;

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.in_service).length;

    return {
      totalEmployees,
      activeEmployees,
    };
  }, [employees]);

  const fetchEmployees = useCallback(async () => {
    try {

      const response = await fetch("/api/employees", {
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

      setEmployees(result.employees || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la récupération des employés";
      toast.error(errorMessage);
      console.error("Erreur Employees:", err);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEmployeeClick = useCallback((employee: Data) => {
    setSelectedEmployee(employee as Employee);
    setModalIsOpen(true);
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-6">
          <Card
            title="Total d'employés"
            value={stats.totalEmployees.toString()}
          />

          <Card
            title="Employés en service"
            value={stats.activeEmployees.toString()}
            countCircle={true}
          />
        </div>

        <div className="flex items-center w-full">
          <Table
            name="Employés"
            columns={[
              { label: "Nom", value: "name" },
              {
                label: "Statut",
                value: "in_service",
                badge: { on: "En service", off: "Hors service" },
              },
              { label: "Grade", value: "grade", muted: true },
              {
                label: "Salaire",
                value: "salary",
                end: "$",
                number: true,
                muted: true,
              },
              { label: "Téléphone", value: "phone" },
              { label: "IBAN", value: "iban" },
            ]}
            data={employees}
            filterCategory={["first_name", "last_name", "character_id", "id"]}
            onClick={handleEmployeeClick}
          />
        </div>

        {selectedEmployee && (
          <EditEmployee
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
            employee={selectedEmployee}
            setEmployee={setSelectedEmployee}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
