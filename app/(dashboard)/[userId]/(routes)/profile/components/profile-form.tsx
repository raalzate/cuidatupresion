"use client";

import { default as ReactSelect } from "react-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const formSchema = z.object({
  relevantConditions: z
    .string()
    .array()
    .min(1, "Debe seleccionar al menos una condición relevante"),
  medications: z
    .string()
    .array()
    .min(1, "Debe seleccionar al menos un medicamento"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  birthdate: z
    .date()
    .min(
      new Date("1900-01-01"),
      "La fecha de nacimiento no puede ser anterior a 1900"
    )
    .max(new Date(), "La fecha de nacimiento no puede ser en el futuro"),
  gender: z.string().min(1, "El género es obligatorio"),
  doctorAccessCode: z
    .string()
    .min(6, "El código de acceso del doctor debe tener al menos 6 caracteres"),
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface MedicalFormProps {
  initialData: ProfileFormValues;
}

const animatedComponents = makeAnimated();

const TAGS = ["en reposo", "en actividad", "estrés", "ansiedad"];

export const ProfileForm: React.FC<MedicalFormProps> = ({ initialData }) => {
  const tagsOptions = TAGS.map((tagItem) => ({
    label: tagItem,
    value: tagItem.replaceAll(" ", "_"),
  }));

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          relevantConditions: [],
          medications: [],
          name: "",
          email: "",
          birthdate: new Date(),
          gender: "",
          doctorAccessCode: "",
        },
  });

  const onSubmit = () => {};

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          description="Administrar perfil médico básico"
          title="Perfil"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Nombre del usuario"
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Correo electrónico"
                      type="email"
                      {...field}
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
    </>
  );
};
