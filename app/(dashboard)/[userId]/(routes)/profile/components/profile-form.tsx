'use client';

import { CalendarIcon } from 'lucide-react';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import makeAnimated from 'react-select/animated';

import { apiClient } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/shared/separator/separator';

import { GENDERS } from '../constants';

const CreatableSelect = dynamic(() => import('react-select/creatable'), {
  ssr: false,
});

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido'),
  birthdate: z.date(),
  gender: z.string().min(1, 'El género es obligatorio'),
  doctorAccessCode: z
    .string()
    .min(6, 'El código de acceso del doctor debe tener al menos 6 caracteres'),
  height: z.coerce
    .number({ invalid_type_error: 'La altura debe ser un número válido.' })
    .min(1, 'La altura es requerida.')
    .min(50, 'La altura debe ser mayor a 50 cm')
    .max(250, 'La altura debe ser menor a 250 cm'),
  weight: z.coerce
    .number({ invalid_type_error: 'El peso debe ser un número válido.' })
    .min(1, 'El peso es requerido.')
    .min(10, 'El peso debe ser mayor a 10 kg')
    .max(300, 'El peso debe ser menor a 300 kg'),
  relevantConditions: z.string().array(),
  medications: z.string().array(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface MedicalFormProps {
  initialData: ProfileFormValues;
}

const animatedComponents = makeAnimated();

export const ProfileForm: React.FC<MedicalFormProps> = ({
  initialData,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const toastId = toast.loading('Actualizando perfil...');
    try {
      setLoading(true);
      await apiClient.patch(`/users/${params.userId as string}`, data);
      router.refresh();
      toast.success('Perfil actualizado correctamente', { id: toastId });
    } catch (error) {
      console.log('Error:', error);
      toast.error('Algo salió mal al actualizar el perfil.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

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
                      disabled={loading}
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
                            format(new Date(field.value), 'PPP', { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown-buttons"
                          disabled={(date) =>
                            loading ||
                            date > new Date() ||
                            date < new Date('1900-01-01')
                          }
                          mode="single"
                          onSelect={field.onChange}
                          selected={field.value}
                          locale={es}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
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
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura del paciente (cm)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 170"
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
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso del paciente (kg)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Ej: 75"
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
              name="relevantConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones relevantes</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      value={field.value?.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      onChange={(options) =>
                        field.onChange(options?.map((option) => option.label) || [])
                      }
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      isDisabled={loading}
                      options={[]}
                      placeholder="Añade condiciones relevantes"
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
                      value={field.value?.map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      onChange={(options) =>
                        field.onChange(options?.map((option) => option.label) || [])
                      }
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      isDisabled={loading}
                      options={[]}
                      placeholder="Añade medicamentos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="ml-auto" disabled={loading} type="submit">
            Guardar cambios
          </Button>
        </form>
      </Form>
    </>
  );
};
