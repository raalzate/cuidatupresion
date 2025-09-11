"use client";

import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import makeAnimated from "react-select/animated";

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

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const formSchema = z.object({
  diastolicPressure: z
    .transform(Number)
    .pipe(
      z
        .number({ message: "Debe ser un número válido" })
        .min(40, "La presión diastólica debe ser mayor a 40 mmHg")
        .max(120, "La presión diastólica debe ser menor a 120 mmHg")
    ),
  heartRate: z
    .transform(Number)
    .pipe(
      z
        .number({ message: "Debe ser un número válido" })
        .min(30, "La frecuencia cardíaca debe ser mayor a 30 bpm")
        .max(220, "La frecuencia cardíaca debe ser menor a 220 bpm")
    ),
  tags: z.string().array().min(1, "Debe seleccionar al menos una observación"),
  systolicPressure: z
    .transform(Number)
    .pipe(
      z
        .number({ message: "Debe ser un número válido" })
        .min(70, "La presión sistólica debe ser mayor a 70 mmHg")
        .max(200, "La presión sistólica debe ser menor a 200 mmHg")
    ),
});

type MedicalFormValues = z.infer<typeof formSchema>;

interface MedicalFormProps {
  initialData: MedicalFormValues;
}

const animatedComponents = makeAnimated();

export const MeasurementForm: React.FC<MedicalFormProps> = ({
  initialData,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

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

  const onSubmit = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading description="Administrar datos médicos" title="Ajustes" />
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones adicionales</FormLabel>

                  <FormControl>
                    <CreatableSelect
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={field.value.map((tag: string) => ({
                        label: tag,
                        value: tag.replaceAll(" ", "_"),
                      }))}
                      isDisabled={loading}
                      onChange={() => {}}
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
        onClose={() => {
          setShowModal(false);
        }}
        title="Hola"
      >
        <p>Está seguro de los valores a ingresar? Por favor confirme</p>

        <Button
          className="mt-2 mr-5"
          variant="secondary"
          onClick={() => {
            toast.success("Cancelado");
            setLoading(false);
          }}
        >
          Cancelar
        </Button>
        <Button
          className="mt-2"
          onClick={() => toast.success("Cambios guardados")}
        >
          Confirmar lectura
        </Button>
      </Modal>
    </>
  );
};
