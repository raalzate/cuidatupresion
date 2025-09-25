"use client";

import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { getToken } from "firebase/messaging";

import { AppAlert } from "@/components/shared/alert/alert";
import { DashboardBreadcrumb } from "./components/dashboard-breadcrumb";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { Separator } from "@/components/shared/separator/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAlertStore } from "@/stores/alert/alert.store";
import { messaging } from "@/lib/firebase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showHypotensionAlert = useAlertStore(
    (state) => state.showHypotensionAlert
  );
  const showHypertensionAlert = useAlertStore(
    (state) => state.showHypertensionAlert
  );

  const { setToken, notificationPermission, setNotificationPermission } =
    useAlertStore((state) => ({
      setToken: state.setToken,
      notificationPermission: state.notificationPermission,
      setNotificationPermission: state.setNotificationPermission,
    }));

  useEffect(() => {
    // Registrar el Service Worker (tu código original está bien)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration);
        })
        .catch((err) => {
          console.error("Error registrando Service Worker:", err);
        });
    }

    const setupNotifications = async () => {
      // Comprobar si Firebase Messaging y Notifications son compatibles
      if (!messaging || !("Notification" in window)) {
        setNotificationPermission("denied"); // No hay soporte, lo marcamos como denegado
        return;
      }

      let currentPermission = Notification.permission;

      if (currentPermission === "default") {
        currentPermission = await Notification.requestPermission();
      }

      setNotificationPermission(currentPermission);

      // Si el permiso fue concedido, obtenemos el token
      if (currentPermission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          console.log("FCM Token:", token);
          setToken(token);
        } catch (err) {
          console.error("Error obteniendo el token:", err);
        }
      } else {
        console.warn(`Permiso de notificaciones: ${currentPermission}`);
        setToken("");
      }
    };

    setupNotifications();
  }, [setToken, setNotificationPermission]);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* --- 3. AÑADE LA ALERTA CONDICIONAL (DISCLAIMER) --- */}
          {notificationPermission !== "granted" && (
            <AppAlert
              icon={<AlertCircleIcon />}
              title="Activar notificaciones"
              variant="info"
            >
              <p>
                Para recibir alertas importantes sobre su salud en tiempo real,
                por favor active las notificaciones en la configuración de su
                navegador.
              </p>
            </AppAlert>
          )}

          {showHypotensionAlert && (
            <AppAlert
              icon={<AlertCircleIcon />}
              title="¡Atención! Su presión arterial es baja"
              variant="info"
            >
              <p>
                Si se siente mareado, débil o aturdido, siéntese o recuéstese de
                inmediato para prevenir una caída. Informe a su médico sobre
                esta lectura.
              </p>
            </AppAlert>
          )}

          {showHypertensionAlert && (
            <AppAlert
              icon={<AlertCircleIcon />}
              title="¡Atención! Su última toma de presión indica crisis hipertensiva"
              variant="destructive"
            >
              <p>Por favor contacte a un médico lo más pronto posible.</p>
            </AppAlert>
          )}

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}