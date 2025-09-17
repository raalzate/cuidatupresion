"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiClient } from "@/services/api";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { Heading } from "@/components/shared/heading/heading";
import { Measurements, MeasurementTags, Tags } from "@prisma/client";
import { BloodPressureChart } from "../components/overview-chart";
import { Separator } from "@radix-ui/react-separator";

type MeasurementTagsProps = { tag: Tags } & MeasurementTags;
type MeasurementResponse = Measurements & { tags: MeasurementTagsProps[] };

const GrapthPage = () => {
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

  const formattedMeasurements = measurements.map((measurement) => ({
    timestamp: new Date(measurement.createdAt).getTime(),
    systolic: measurement.systolicPressure,
    diastolic: measurement.diastolicPressure,
  }));

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <p>Cargando grafica...</p>
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
        <div className="flex items-center justify-between">
          <Heading
            description="Aquí podrás ver una grafica con el historial de tus mediciones."
            title="Grafica de historial"
          />
        </div>

        <Separator />
        <br />
        <BloodPressureChart data={formattedMeasurements} />
      </div>
    </div>
  );
};

export default GrapthPage;
