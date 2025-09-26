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
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  title: z.string().min(1).max(70),
  startDate: z
    .date()
    .min(new Date(), "La fecha debe ser igual o posterior a la actual"),
  value: z.string().min(4),
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

  const title = initialData ? "Editar notificación" : "Crear notificación";
  const description = initialData
    ? "Editar notificación"
    : "Agregar una nueva notificación";
  const toastMessage = initialData
    ? "Notificación actualizada"
    : "Notificación creada";
  const action = initialData ? "Guardar cambios" : "Crear";

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      value: "",
    },
  });

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await apiClient.patch(
          `/api/${params?.userId}/notifications/${params?.notificationId}`,
          data
        );
      } else {
        await apiClient.post(`/api/${params?.userId}/notifications`, data);
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
        `/api/${params?.userId}/notifications/${params?.notificationId}`
      );

      router.refresh();
      router.push(`/${params?.userId}/notifications`);

      toast.success("Notificación eliminada.");
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
              name="startDate"
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>

                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Valor de la notificación"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
