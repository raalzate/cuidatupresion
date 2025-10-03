"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/shared/separator/separator";
import { LoaderIcon, Heart, Activity } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Measurement {
  id: string;
  heartRate: number;
  systolicPressure: number;
  diastolicPressure: number;
  tags: string;
  date: string;
  createdAt: string;
}

interface UserInfo {
  name: string;
  email: string;
}

interface SharedData {
  success: boolean;
  user: UserInfo;
  measurements: Measurement[];
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
        const response = await fetch("/api/check-shared-measurement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Error al cargar los datos");
          return;
        }

        setData(result);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos compartidos...</p>
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
        {/* Header */}
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

        {/* Summary Cards */}
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

        {/* Measurements List */}
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
                          <div className="text-lg font-semibold">
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
                          <div className="text-sm text-blue-600">
                            Etiquetas: {measurement.tags}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            measurement.systolicPressure >= 140 ||
                            measurement.diastolicPressure >= 90
                              ? "bg-red-500"
                              : measurement.systolicPressure >= 130 ||
                                measurement.diastolicPressure >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          title={
                            measurement.systolicPressure >= 140 ||
                            measurement.diastolicPressure >= 90
                              ? "Presión alta"
                              : measurement.systolicPressure >= 130 ||
                                measurement.diastolicPressure >= 80
                              ? "Presión elevada"
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

        {/* Footer */}
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
