'use client';

import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { apiClient } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/shared/heading/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/shared/separator/separator';

const formSchema = z.object({
  systolicPressure: z.coerce
    .number({
      invalid_type_error: 'La presión sistólica debe ser un número válido.',
    })
    .min(1, 'La presión sistólica es requerida.')
    .min(70, 'La presión sistólica debe ser mayor a 70 mmHg')
    .max(200, 'La presión sistólica debe ser menor a 200 mmHg'),
  diastolicPressure: z.coerce
    .number({
      invalid_type_error: 'La presión diastólica debe ser un número válido.',
    })
    .min(1, 'La presión diastólica es requerida.')
    .min(40, 'La presión diastólica debe ser mayor a 40 mmHg')
    .max(120, 'La presión diastólica debe ser menor a 120 mmHg'),
  heartRate: z.coerce
    .number({ invalid_type_error: 'La frecuencia cardíaca debe ser un número válido.' })
    .min(1, 'La frecuencia cardíaca es requerida.')
    .min(30, 'La frecuencia cardíaca debe ser mayor a 30 bpm')
    .max(220, 'La frecuencia cardíaca debe ser menor a 220 bpm'),
});

type MeasurementFormValues = z.infer<typeof formSchema>;

export const MeasurementForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<MeasurementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: MeasurementFormValues) => {
    const toastId = toast.loading('Guardando medición...');
    try {
      setLoading(true);
      // Endpoint corregido a /measurements
      await apiClient.post(`/users/${params.userId}/measurements`, data);

      toast.success('Medición guardada con éxito', { id: toastId });
      router.refresh();
      router.push(`/${params.userId}/history`);
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('No se pudo guardar la medición.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          description="Añadir una nueva medición de presión arterial"
          title="Nueva Medición"
        />
      </div>

      <Separator />

      <Form {...form}>
        <form
          className="space-y-8 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="systolicPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión sistólica (mmHg)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 120"
                      type="number"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diastolicPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión diastólica (mmHg)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 80"
                      type="number"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia cardíaca (bpm)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 70"
                      type="number"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="ml-auto" disabled={loading} type="submit">
            Guardar Medición
          </Button>
        </form>
      </Form>
    </>
  );
};
