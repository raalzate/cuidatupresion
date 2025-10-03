"use client";

import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Heart, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { apiClient } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { Separator } from "@/components/shared/separator/separator";
import {
  isHypertensiveCrisis,
  isHypotensiveCrisis,
} from "@/utils/bloodPressure";

interface Measurement {
  createdAt: string;
  date: string;
  diastolicPressure: number;
  heartRate: number;
  id: string;
  systolicPressure: number;
  tags: string;
}

interface UserInfo {
  email: string;
  name: string;
}

interface SharedData {
  measurements: Measurement[];
  success: boolean;
  user: UserInfo;
  tokenInfo: {
    userId: string;
    issuedAt: string;
    expiresAt: string;
  };
}

export default function SharedMeasurementsPage() {
  const params = useParams();
  const token = params?.token as string;

  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchSharedData = async () => {
      try {
        const response = await apiClient.post<SharedData>(
          "/check-shared-measurement",
          { token }
        );

        setData(response);
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <EmptyState
            subtitle="Pronto podrás ver los datos compartidos."
            title="Cargando datos compartidos..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial Médico Compartido
          </h1>

          <p className="text-muted-foreground">
            Datos de presión arterial de <strong>{data.user.name}</strong>
          </p>

          <p className="text-sm text-muted-foreground mt-2">
            Enlace válido hasta:{" "}
            {format(
              new Date(data.tokenInfo.expiresAt),
              "dd 'de' MMMM yyyy 'a las' HH:mm",
              { locale: es }
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mediciones
              </CardTitle>

              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {data.measurements.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Última Medición
              </CardTitle>

              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {data.measurements.length > 0
                  ? `${data.measurements[0].systolicPressure}/${data.measurements[0].diastolicPressure}`
                  : "N/A"}
              </div>

              <p className="text-xs text-muted-foreground">
                {data.measurements.length > 0 && data.measurements[0].date}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Frecuencia Cardíaca
              </CardTitle>

              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {data.measurements.length > 0
                  ? `${data.measurements[0].heartRate} bpm`
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Mediciones</CardTitle>
          </CardHeader>

          <CardContent>
            {data.measurements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay mediciones registradas
              </p>
            ) : (
              <div className="space-y-4">
                {data.measurements.map((measurement, index) => (
                  <div key={measurement.id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <div
                            className={`text-lg font-semibold ${
                              isHypertensiveCrisis(
                                measurement.systolicPressure,
                                measurement.diastolicPressure
                              )
                                ? "text-red-500"
                                : isHypotensiveCrisis(
                                    measurement.systolicPressure,
                                    measurement.diastolicPressure
                                  )
                                ? "text-blue-700"
                                : ""
                            }`}
                          >
                            {measurement.systolicPressure}/
                            {measurement.diastolicPressure} mmHg
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {measurement.heartRate} bpm
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {measurement.date}
                        </div>

                        {measurement.tags && (
                          <div className="text-sm">
                            Etiquetas: {measurement.tags}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isHypertensiveCrisis(
                              measurement.systolicPressure,
                              measurement.diastolicPressure
                            )
                              ? "bg-red-500"
                              : isHypotensiveCrisis(
                                  measurement.systolicPressure,
                                  measurement.diastolicPressure
                                )
                              ? "bg-blue-700"
                              : "bg-green-500"
                          }`}
                          title={
                            isHypertensiveCrisis(
                              measurement.systolicPressure,
                              measurement.diastolicPressure
                            )
                              ? "Presión alta"
                              : isHypertensiveCrisis(
                                  measurement.systolicPressure,
                                  measurement.diastolicPressure
                                )
                              ? "Presión baja"
                              : "Presión normal"
                          }
                        />
                      </div>
                    </div>
                    {index < data.measurements.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Este enlace es temporal y expirará automáticamente por seguridad.
          </p>

          <p className="mt-1">
            Generado el{" "}
            {format(
              new Date(data.tokenInfo.issuedAt),
              "dd 'de' MMMM yyyy 'a las' HH:mm",
              { locale: es }
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
