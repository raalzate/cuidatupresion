"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiClient } from "@/services/api";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { MeasurementClient } from "./components/client";
import { MeasurementColumns } from "./components/columns";
import { Measurements, MeasurementTags, Tags } from "@prisma/client";

type MeasurementTagsProps = { tag: Tags } & MeasurementTags;
type MeasurementResponse = Measurements & { tags: MeasurementTagsProps[] };

const HistoryPage = () => {
  const params = useParams();
  const userId = `${params?.userId}`;

  const [measurements, setMeasurements] = useState<MeasurementResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);

        const data = await apiClient.get<MeasurementResponse[]>(
          `/users/${userId}/measurements`
        );

        setMeasurements(data);
      } catch (error) {
        console.error("Error fetching medical history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMedicalHistory();
    }
  }, [userId]);

  const formattedMeasurements: MeasurementColumns[] = measurements.map(
    (measurement) => ({
      heartRate: measurement.heartRate,
      systolicPressure: measurement.systolicPressure,
      diastolicPressure: measurement.diastolicPressure,
      tags: measurement.tags.map((tag) => tag.tag.name).join(", "),
      date: format(measurement.createdAt, "dd/MM/yyyy HH:mm"),
    })
  );

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            ctaHref={`/${userId}/measurement`}
            ctaLabel="Añadir medición"
            subtitle="Pronto podrás ver tu información."
            title="Cargando tus mediciones..."
          />
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            ctaHref={`/${userId}/measurement`}
            ctaLabel="Añadir mi primera medición"
            subtitle="Empieza por añadir tu primera toma de presión para empezar a construir tu historial."
            title="Aún no tienes un historial que mostrar"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MeasurementClient data={formattedMeasurements} userId={userId} />
      </div>
    </div>
  );
};

export default HistoryPage;
