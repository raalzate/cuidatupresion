'use client';

import { useEffect, useState } from 'react';
import { VerticalTimeline } from 'react-vertical-timeline-component';

import { EmptyState } from '@/components/shared/empty-state/empty-state';
import { apiClient } from '@/services/api';

import { HistoryTimeline } from './components/history-timeline';

import 'react-vertical-timeline-component/style.min.css';
import { useParams } from 'next/navigation';

// Representa una medición tal como llega al cliente (Date -> string)
interface ClientMeasurement {
  id: string;
  systolicPressure: number;
  diastolicPressure: number;
  heartRate: number;
  createdAt: string;
}

// Se definen las props directamente en la firma del componente para evitar conflictos de tipos.
const HistoryPage = () => {
  const params = useParams();
  
  const [measurements, setMeasurements] = useState<ClientMeasurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get<ClientMeasurement[]>(
          `/users/${params.userId}/measurements`
        );
        setMeasurements(data);
      } catch (error) {
        console.error('Error fetching medical history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) {
      fetchMedicalHistory();
    }
  }, [params.userId]);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <p>Cargando historial...</p>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            title="Aún no tienes un historial que mostrar"
            subtitle="Empieza por añadir tu primera toma de presión para empezar a construir tu historial."
            ctaLabel="Añadir mi primera medición"
            ctaHref={`/${params.userId}/measurement`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col">
          <VerticalTimeline lineColor="#e5e7eb">
            {measurements.map((measurement) => (
              <HistoryTimeline key={measurement.id} measurement={measurement} />
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
