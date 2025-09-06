"use client";

import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Patient } from "@prisma/client";
import { useAuthStore } from "@/stores/auth/auth.store";

const formSchema = z.object({
  doctorAccessCode: z
    .string()
    .min(6, "El código de acceso del doctor debe tener al menos 6 caracteres"),
});

type DoctorFormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { data: session, status } = useSession();
  const [showDoctorDialog, setShowDoctorDialog] = useState(false);

  const router = useRouter();

  const loginUser = useAuthStore((state) => state.loginUser);

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorAccessCode: "",
    },
    mode: "all",
  });

  const handleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    signIn("google");
  };

  const checkUserEmail = useCallback(
    async (email: string) => {
      try {
        const { data: user } = await axios.get<Patient>(
          `/api/users?userEmail=${encodeURIComponent(email)}`
        );

        if (user && user.doctorId) {
          loginUser(user.id, user.email);

          router.push(`/${user.id}/profile`);
        }
      } catch (error) {
        console.log("Error:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setShowDoctorDialog(true);
          } else {
            toast.error(`${error.response?.data}`);
          }
        }
      }
    },
    [loginUser, router]
  );

  useEffect(() => {
    if (status === "authenticated" && session.user && session.user.email) {
      checkUserEmail(session.user.email);
    }
  }, [status, session, checkUserEmail]);

  const handleCreateUser = async (data: DoctorFormValues) => {
    try {
      if (!form) return;

      const userData = {
        doctorAccessCode: data.doctorAccessCode,
        email: session?.user?.email,
        name: session?.user?.name,
      };

      const { data: user } = await axios.post<Patient>("/api/users", userData);

      if (user) {
        loginUser(user.id, user.email);

        router.push(`/${user.id}/profile`);
      }
    } catch (error) {
      console.log("Error:", error);

      toast.error(`${error.response?.data}`);
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">¡Bienvenido!</h1>

                  <p className="text-muted-foreground text-balance mt-4">
                    Es un placer tenerte de regreso. ¡Iniciemos sesión!
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignIn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Ingresar con Google
                </Button>

                <div className="text-center text-sm text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                  Al iniciar sesión, aceptas nuestros{" "}
                  <a href="#" className="underline underline-offset-4">
                    Términos de Servicio
                  </a>{" "}
                  y{" "}
                  <a href="#" className="underline underline-offset-4">
                    Política de Privacidad
                  </a>
                  .
                </div>
              </div>
            </form>

            <div className="bg-muted relative hidden md:block">
              <Image
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                height={300}
                src="/images/placeholder.svg"
                width={300}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDoctorDialog} onOpenChange={setShowDoctorDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form
              className="space-y-8 w-full mt-4"
              onSubmit={form.handleSubmit(handleCreateUser)}
            >
              <DialogHeader>
                <DialogTitle>¡Bienvenido!</DialogTitle>

                <DialogDescription>
                  Por favor ingresa el código del doctor que estará encargado de
                  revisar tu perfil médico
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="doctorAccessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de acceso del doctor</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Código de acceso del doctor"
                        type="text"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Enviar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
