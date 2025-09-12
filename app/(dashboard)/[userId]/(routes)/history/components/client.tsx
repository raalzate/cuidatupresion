"use client";

import { columns, MeasurementColumns } from "./columns";
import { DataTable } from "@/components/shared/data-table/data-table";
import { Heading } from "@/components/shared/heading/heading";
import { Separator } from "@/components/shared/separator/separator";

interface MeasurementClientProps {
  data: MeasurementColumns[];
}

export const MeasurementClient: React.FC<MeasurementClientProps> = ({
  data,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          description="Aquí podrás ver todas las mediciones médicas"
          title="Mediciones"
        />
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="tags" />
    </>
  );
};
