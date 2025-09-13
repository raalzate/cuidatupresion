"use client";

import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import makeAnimated from "react-select/animated";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/shared/heading/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/shared/separator/separator";
import { ADDITIONAL_TAGS } from "@/config/config";
import { Modal } from "@/components/shared/modal/modal";

import { PSYS_MAX, PDYS_MAX, PSYS_MIN, PDYS_MIN, PULSE_MAX, PULSE_MIN } from "@/config/config";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

const formSchema = z.object({
  diastolicPressure: z
    .transform(Number)
    .pipe(
      z
        .number({ message: "Debe ser un número válido" })
        .min(PDYS_MIN, `La presión diastólica debe ser mayor a ${PDYS_MIN} mmHg`)
        .max(PDYS_MAX, `La presión diastólica debe ser menor a ${PDYS_MAX} mmHg`)
    ),
  heartRate: z
    .transform(Number)
    .pipe(
      z
        .number({ message: "Debe ser un número válido" })
        .min(PULSE_MIN, `La frecuencia cardíaca debe ser mayor a ${PULSE_MIN} lpm`)
        .max(PULSE_MAX, `La frecuencia cardíaca debe ser menor a ${PULSE_MAX} lpm`)
    ),
  tags: z.string().array().min(1, "Debe seleccionar al menos una observación"),
  systolicPressure: z
    .transform(Number)
    .pipe(
      z
        .number({ message: "Debe ser un número válido" })
        .min(PSYS_MIN, `La presión sistólica debe ser mayor a ${PSYS_MIN} mmHg`)
        .max(PSYS_MAX, `La presión sistólica debe ser menor a ${PSYS_MAX} mmHg`)
    ),
});

type MedicalFormValues = z.infer<typeof formSchema>;

interface MedicalFormProps {
  initialData: MedicalFormValues;
  userId: string;
}

const animatedComponents = makeAnimated();

export const MeasurementForm: React.FC<MedicalFormProps> = ({
  initialData,
  userId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<MedicalFormValues | null>(null);
  const router = useRouter();

  const tagsOptions = ADDITIONAL_TAGS.map((tagItem) => ({
    label: tagItem,
    value: tagItem.replaceAll(" ", "_"),
  }));

  const form = useForm<MedicalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          diastolicPressure: 0,
          heartRate: 0,
          tags: [],
          systolicPressure: 0,
        },
  });

  const onSubmit = (data: MedicalFormValues) => {
    setFormData(data);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;

    try {
      setLoading(true);
      
      await axios.post(`/api/users/${userId}/measurement`, {
        diastolicPressure: formData.diastolicPressure,
        systolicPressure: formData.systolicPressure,
        heartRate: formData.heartRate,
        tags: formData.tags,
      });

      toast.success("Medición guardada correctamente");
      setShowModal(false);
      
      // Reset form
      form.reset({
        diastolicPressure: 0,
        heartRate: 0,
        tags: [],
        systolicPressure: 0,
      });
      
      // Optionally redirect to history page
      router.push(`/${userId}/history`);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la medición");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setFormData(null);
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading description="Registra los datos de tu lectura de presión arterial en el siguiente formulario" title="Registrar Lectura de Presión Arterial" />
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
              name="diastolicPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión diastólica</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Presión diastólica del usuario"
                      type="number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systolicPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión sistólica</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Presión sistólica del usuario"
                      type="number"
                      {...field}
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
                  <FormLabel>Frecuencia cardíaca</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Frecuencia cardíaca del usuario"
                      type="number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones adicionales</FormLabel>

                  <FormControl>
                    <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      value={field.value.map((tag: string) => ({
                        label: tag,
                        value: tag.replaceAll(" ", "_"),
                      }))}
                      isDisabled={loading}
                      onChange={(selectedOptions) => {
                        const selectedTags = selectedOptions && Array.isArray(selectedOptions)
                          ? selectedOptions.map((option: { label: string; value: string }) => option.label)
                          : [];
                        field.onChange(selectedTags);
                      }}
                      options={tagsOptions}
                      placeholder="Selecciona las opciones"
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          boxShadow: "none",
                          borderColor: state.isFocused ? "black" : "",
                          "&:hover": {
                            borderColor: state.isFocused ? "black" : "",
                          },
                        }),
                      }}
                      isMulti
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="ml-auto" type="submit">
            Guardar cambios
          </Button>
        </form>
      </Form>

      <Modal
        description="Confirmar lectura de presion"
        isOpen={showModal}
        onClose={handleCancel}
        title="Confirmar medición"
      >
        <p>¿Está seguro de los valores a ingresar? Por favor confirme</p>
        
        {formData && (
          <div className="my-4 p-4 bg-gray-50 rounded-md">
            <p><strong>Presión sistólica:</strong> {formData.systolicPressure} mmHg</p>
            <p><strong>Presión diastólica:</strong> {formData.diastolicPressure} mmHg</p>
            <p><strong>Frecuencia cardíaca:</strong> {formData.heartRate} bpm</p>
            <p><strong>Observaciones:</strong> {formData.tags.join(", ")}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Confirmar lectura"}
          </Button>
        </div>
      </Modal>
    </>
  );
};
