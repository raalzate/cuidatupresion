"use client";

import {
  isHypertensiveCrisis,
  isHypotensiveCrisis,
} from "@/utils/bloodPressure";
import { ColumnDef } from "@tanstack/react-table";

export type MeasurementColumns = {
  date: string;
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
    cell: ({ row }) =>
      isHypertensiveCrisis(
        row.original.systolicPressure,
        row.original.diastolicPressure
      ) ? (
        <span className="text-red-500 font-bold">
          {row.original.systolicPressure}
        </span>
      ) : isHypotensiveCrisis(
          row.original.systolicPressure,
          row.original.diastolicPressure
        ) ? (
        <span className="text-blue-700 font-bold">
          {row.original.systolicPressure}
        </span>
      ) : (
        row.original.systolicPressure
      ),
  },
  {
    accessorKey: "diastolicPressure",
    header: "Presión Diastólica (mmHg)",
    cell: ({ row }) =>
      isHypertensiveCrisis(
        row.original.systolicPressure,
        row.original.diastolicPressure
      ) ? (
        <span className="text-red-500 font-bold">
          {row.original.diastolicPressure}
        </span>
      ) : isHypotensiveCrisis(
          row.original.systolicPressure,
          row.original.diastolicPressure
        ) ? (
        <span className="text-blue-700 font-bold">
          {row.original.diastolicPressure}
        </span>
      ) : (
        row.original.diastolicPressure
      ),
  },
  {
    accessorKey: "tags",
    header: "Etiquetas",
  },
  {
    accessorKey: "date",
    header: "Fecha",
  },
];
