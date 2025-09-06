"use client";

import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import makeAnimated from "react-select/animated";
import { Medications, RelevantConditions } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GENDERS, INITIAL_DATA } from "../constants";

const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const formSchema = z.object({
  relevantConditions: z.object({ id: z.string() }).array(),
  medications: z.object({ id: z.string() }).array(),
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
  height: z
    .number()
    .min(50, "La altura debe ser mayor a 50 cm")
    .max(250, "La altura debe ser menor a 250 cm")
    .int("La altura debe ser un número entero"),
  weight: z
    .number()
    .min(10, "El peso debe ser mayor a 10 kg")
    .max(300, "El peso debe ser menor a 300 kg"),
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface MedicalFormProps {
  initialData: ProfileFormValues;
  medications: Medications[];
  relevantConditions: RelevantConditions[];
}

const animatedComponents = makeAnimated();

export const ProfileForm: React.FC<MedicalFormProps> = ({
  initialData,
  medications,
  relevantConditions,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const relevantConditionsOptions = relevantConditions.map(
    (relevantCondition) => {
      return {
        value: relevantCondition.id,
        label: relevantCondition.name,
      };
    }
  );

  const medicationsOptions = medications.map((medication) => {
    return {
      value: medication.id,
      label: medication.name,
    };
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          ...INITIAL_DATA,
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
                      placeholder="Nombre del paciente"
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
                      disabled
                      placeholder="Correo electrónico"
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>

                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!field.value}
                          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          formatters={{
                            formatMonthDropdown: (date) =>
                              date.toLocaleString("es", { month: "long" }),
                            formatYearDropdown: (date) =>
                              date.getFullYear().toString(),
                            formatWeekdayName: (date) =>
                              date.toLocaleDateString("es", {
                                weekday: "narrow",
                              }),
                            formatCaption: (date) =>
                              date.toLocaleDateString("es", {
                                month: "long",
                                year: "numeric",
                              }),
                          }}
                          labels={{
                            labelNext: () => "Mes siguiente",
                            labelPrevious: () => "Mes anterior",
                            labelMonthDropdown: () => "Seleccionar mes",
                            labelYearDropdown: () => "Seleccionar año",
                            labelDay: (date) =>
                              date.toLocaleDateString("es", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }),
                            labelWeekday: (date) =>
                              date.toLocaleDateString("es", {
                                weekday: "long",
                              }),
                          }}
                          locale={es}
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Género</FormLabel>

                  <Select
                    defaultValue={field.value}
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona un género"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender.id} value={gender.id}>
                          {gender.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctorAccessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de acceso del médico</FormLabel>

                  <FormControl>
                    <Input
                      disabled
                      placeholder="Código de acceso del médico"
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
              name="relevantConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones relevantes</FormLabel>

                  <FormControl>
                    <CreatableSelect
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={field.value.map(
                        (relevantCondition: RelevantConditions) => ({
                          label: relevantCondition.name,
                          value: relevantCondition.id,
                        })
                      )}
                      onChange={(
                        relevantCondition: Array<{
                          label: string;
                          value: string;
                        }>
                      ) =>
                        field.onChange(
                          relevantCondition.map((relevantConditionItem) => {
                            return {
                              id: relevantConditionItem.value,
                            };
                          })
                        )
                      }
                      options={relevantConditionsOptions}
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

            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicamentos</FormLabel>

                  <FormControl>
                    <CreatableSelect
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={field.value.map(
                        (medication: Medications) => ({
                          label: medication.name,
                          value: medication.id,
                        })
                      )}
                      onChange={(
                        medication: Array<{
                          label: string;
                          value: string;
                        }>
                      ) =>
                        field.onChange(
                          medication.map((medicationItem) => {
                            return {
                              id: medicationItem.value,
                            };
                          })
                        )
                      }
                      options={medicationsOptions}
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

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura del paciente (cm)</FormLabel>

                  <FormControl>
                    <Input placeholder="Altura" type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso del paciente (kg)</FormLabel>

                  <FormControl>
                    <Input placeholder="Peso" type="number" {...field} />
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
