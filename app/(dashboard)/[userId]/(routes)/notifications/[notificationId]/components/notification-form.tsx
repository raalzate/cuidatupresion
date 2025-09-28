"use client";

import { toast } from "react-hot-toast";
import { CalendarIcon, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import * as z from "zod";

import { apiClient } from "@/services/api";
import { AlertModal } from "@/components/shared/alert-modal/alert-modal";
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
import { Separator } from "@/components/shared/separator/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useAlertStore } from "@/stores/alert/alert.store";

import {
  NOTIFICATION_TYPE_OPTIONS,
  REPEAT_INTERVAL_OPTIONS,
} from "../constants";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(70, "El título debe tener menos de 70 caracteres"),
  type: z.string().min(1, "El tipo es obligatorio"),
  startDate: z
    .date()
    .min(new Date(), "La fecha debe ser igual o posterior a la actual"),
  repeatInterval: z.string(),
  additionalNotes: z
    .string()
    .max(255, "Las notas adicionales deben tener menos de 255 caracteres"),
});

type NotificationFormValues = z.infer<typeof formSchema>;

interface NotificationFormProps {
  initialData: NotificationFormValues | null;
  userId: string;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const pushToken = useAlertStore((state) => state.token);

  const title = initialData ? "Editar recordatorio" : "Crear recordatorio";
  const description = initialData
    ? "Editar recordatorio"
    : "Agregar un nuevo recordatorio";
  const toastMessage = initialData
    ? "Recordatorio actualizado"
    : "Recordatorio creado";
  const action = initialData ? "Guardar cambios" : "Crear";

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      type: "",
      startDate: (() => {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0);
        return nextHour;
      })(),
      repeatInterval: "0",
      additionalNotes: "",
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("startDate", date);
    }
  };

  const handleTimeChange = (type: "hour" | "ampm", value: string) => {
    const currentDate = form.getValues("startDate") || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    newDate.setMinutes(0);

    form.setValue("startDate", newDate);
  };

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      setLoading(true);

      const notificationPayload = {
        ...data,
        repeatInterval:
          data.type === "CITA_MEDICA" ? 0 : parseInt(data.repeatInterval),
      };

      if (initialData) {
        await apiClient.patch(
          `/users/${params?.userId}/notifications/${params?.notificationId}`,
          notificationPayload
        );
      } else {
        await apiClient.post(`/users/${params?.userId}/notifications`, {
          ...notificationPayload,
          pushToken,
        });
      }

      router.refresh();
      router.push(`/${params?.userId}/notifications`);

      toast.success(toastMessage);
    } catch (error) {
      toast.error(`${error.response?.data}`);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await apiClient.delete(
        `/users/${params?.userId}/notifications/${params?.notificationId}`
      );

      router.refresh();
      router.push(`/${params?.userId}/notifications`);

      toast.success("Recordatorio eliminado.");
    } catch (error) {
      toast.error(`${error.response?.data}`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Título del recordatorio"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de recordatorio</FormLabel>

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
                          placeholder="Selecciona un tipo de recordatorio"
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {NOTIFICATION_TYPE_OPTIONS.map((notificationType) => (
                        <SelectItem
                          key={notificationType.value}
                          value={notificationType.value}
                        >
                          {notificationType.label}
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
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del recordatorio</FormLabel>

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
                            format(field.value, "MM/dd/yyyy HH:mm")
                          ) : (
                            <span>MM/DD/YYYY HH:mm</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="sm:flex">
                          <Calendar
                            captionLayout="dropdown"
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              return loading || date < today;
                            }}
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
                            onSelect={handleDateSelect}
                            selected={field.value}
                          />

                          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                              <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i + 1)
                                  .reverse()
                                  .map((hour) => (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getHours() % 12 ===
                                          hour % 12
                                          ? "default"
                                          : "ghost"
                                      }
                                      className="sm:w-full shrink-0 aspect-square"
                                      onClick={() =>
                                        handleTimeChange(
                                          "hour",
                                          hour.toString()
                                        )
                                      }
                                    >
                                      {hour}
                                    </Button>
                                  ))}
                              </div>
                              <ScrollBar
                                orientation="horizontal"
                                className="sm:hidden"
                              />
                            </ScrollArea>

                            <ScrollArea className="">
                              <div className="flex sm:flex-col p-2">
                                {["AM", "PM"].map((ampm) => (
                                  <Button
                                    key={ampm}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      ((ampm === "AM" &&
                                        field.value.getHours() < 12) ||
                                        (ampm === "PM" &&
                                          field.value.getHours() >= 12))
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("ampm", ampm)
                                    }
                                  >
                                    {ampm}
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") !== "CITA_MEDICA" && (
              <FormField
                control={form.control}
                name="repeatInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetir cada</FormLabel>
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
                            placeholder="Selecciona una frecuencia"
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {REPEAT_INTERVAL_OPTIONS.map((repeatIntervalType) => (
                          <SelectItem
                            key={repeatIntervalType.value}
                            value={repeatIntervalType.value}
                          >
                            {repeatIntervalType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas adicionales</FormLabel>

                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Ingresa aquí notas adicionales sobre tu recordatorio"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
