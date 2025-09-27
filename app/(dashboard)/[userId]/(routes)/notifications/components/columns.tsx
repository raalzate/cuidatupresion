"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type NotificationColumns = {
  id: string;
  type: string;
  repeatInterval: number;
  title: string;
  additionalNotes: string;
  startDate: string;
};

export const columns: ColumnDef<NotificationColumns>[] = [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "type",
    header: "Tipo",
  },
  {
    accessorKey: "startDate",
    header: "Fecha de Inicio",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
