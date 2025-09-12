"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type MeasurementColumns = {
  date: Date;
  diastolicPressure: number;
  heartRate: number;
  systolicPressure: number;
  tags: string;
};

export const columns: ColumnDef<MeasurementColumns>[] = [
  {
    accessorKey: "heartRate",
    header: "Frecuencia Cardiaca (lpm)",
  },
  {
    accessorKey: "systolicPressure",
    header: "Presión Sistólica (mmHg)",
  },
  {
    accessorKey: "diastolicPressure",
    header: "Presión Diastólica (mmHg)",
  },
  {
    accessorKey: "tags",
    header: "Etiquetas",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Fecha
          <ArrowUpDown />
        </Button>
      );
    },
  },
];
