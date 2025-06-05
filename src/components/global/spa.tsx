"use client";

import { useEffect, useState } from "react";
//import logger from "@/utils/logger";
import Dashboard from "@/components/dashboard/dashboard";
import Employees from "@/components/employees/employees";
import Exports from "@/components/exports/exports";
import Garage from "@/components/garage/garage";
import Incomes from "@/components/incomes/incomes";
import Payments from "@/components/payments/payments";
import Runs from "@/components/runs/runs";
import Sales from "@/components/sales/sales";
import Stock from "@/components/stock/stock";

export default function SPA() {
  const [route, setRoute] = useState("dashboard");

  useEffect(() => {
    const getRouteFromHash = () => {
      const hash = window.location.hash.slice(1);
      return hash || "dashboard";
    };

    const handleHashChange = () => {
      setRoute(getRouteFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    setRoute(getRouteFromHash());

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  switch (route) {
    case "employees":
      return <Employees />;
    case "exports":
      return <Exports />;
    case "garage":
      return <Garage />;
    case "incomes":
      return <Incomes />;
    case "payments":
      return <Payments />;
    case "runs":
      return <Runs />;
    case "sales":
      return <Sales />;
    case "stock":
      return <Stock />;


		// Specialities

			// Pawn Shop

			//case "pawn-shop-buyback":
			//	return <PawnShopBuyBack />;


    default:
      return <Dashboard />;
  }
}