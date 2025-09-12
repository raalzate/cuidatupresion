'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Patient } from '@prisma/client';

import { apiClient } from '@/services/api';
import { EmptyState } from '@/components/shared/empty-state/empty-state';
import { Heading } from '@/components/shared/heading/heading';
import { Separator } from '@/components/shared/separator/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverviewChart } from './overview-chart';

// Tipo para las mediciones que llegan al cliente
interface ClientMeasurement {
  id: string;
  systolicPressure: number;
  diastolicPressure: number;
  heartRate: number;
  createdAt: string;
}

interface DashboardClientProps {
  patient: Patient;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ patient }) => {
  const [measurements, setMeasurements] = useState<ClientMeasurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        setLoading(true);
        // Se utiliza el apiClient para obtener los datos del lado del cliente
        const data = await apiClient.get<ClientMeasurement[]>(
          `/users/${patient.id}/measurements`
        );
        setMeasurements(data);
      } catch (error) {
        console.error('Error fetching measurements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();
  }, [patient.id]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading
            title={`¡Hola de nuevo, ${patient.name}!`}
            description="Aquí tienes un resumen de tu salud"
          />
          <Separator />
          <p>Cargando tus mediciones...</p>
        </div>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            title="¡Bienvenido! Aún no tienes mediciones registradas."
            subtitle="Empieza por añadir tu primera toma de presión para llevar un control de tu salud."
            ctaLabel="Añadir mi primera medición"
            ctaHref={`/${patient.id}/measurement`}
          />
        </div>
      </div>
    );
  }

  const lastMeasurement = measurements[0];

  const formattedMeasurements = measurements.map((measurement) => ({
    name: format(new Date(measurement.createdAt), 'dd/MM/yy', { locale: es }),
    systolicPressure: measurement.systolicPressure,
    diastolicPressure: measurement.diastolicPressure,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`¡Hola de nuevo, ${patient.name}!`}
          description="Aquí tienes un resumen de tu salud"
        />
        <Separator />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Última Medición
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lastMeasurement ? (
                  <>
                    {lastMeasurement.systolicPressure} /
                    {lastMeasurement.diastolicPressure} mmHg
                  </>
                ) : (
                  'N/A'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastMeasurement
                  ? format(new Date(lastMeasurement.createdAt), 'dd/MM/yy', {
                      locale: es,
                    })
                  : 'No hay mediciones registradas'}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Evolución de la Presión Arterial</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={formattedMeasurements.reverse()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
