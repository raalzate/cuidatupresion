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

  const setToken = useAlertStore(
      (state) => state.setToken
  );


  useEffect(() => {
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

    if (messaging) {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted" && messaging) {
          try {
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            console.log("FCM Token:", token);// quitar luego
            setToken(token);
          } catch (err) {
            console.error("Error obteniendo token:", err);
          }
        } else {
          console.warn("Permiso de notificaciones denegado");
        }
      });

    }
  }, [setToken]);

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
