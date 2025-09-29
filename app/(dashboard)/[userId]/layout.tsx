"use client";

import { AlertCircleIcon, DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";

// PWA Install Prompt Event interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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

  const setToken = useAlertStore((state) => state.setToken);
  const notificationPermission = useAlertStore(
    (state) => state.notificationPermission
  );
  const setNotificationPermission = useAlertStore(
    (state) => state.setNotificationPermission
  );

  // 🔹 Estado para el botón de instalación PWA
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Registro del service worker (Firebase + PWA)
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

    // 🔹 Captura el evento beforeinstallprompt (para PWA)
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    // Configuración de notificaciones con FCM
    const setupNotifications = async () => {
      let currentPermission = Notification.permission;

      if (!messaging || !("Notification" in window)) {
        setNotificationPermission("denied");
        currentPermission = await Notification.requestPermission();
        return;
      }

      if (currentPermission === "default") {
        currentPermission = await Notification.requestPermission();
      }

      setNotificationPermission(currentPermission);

      if (currentPermission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          console.log("FCM Token:", token);
          setToken(token); // token es un string
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

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("✅ Usuario instaló la app");
    } else {
      console.log("❌ Usuario canceló instalación");
    }
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DashboardBreadcrumb />

          {showInstallButton && (
            <Button
              onClick={handleInstall}
              variant="outline"
              size="sm"
              className="ml-auto flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Instalar App
            </Button>
          )}
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {notificationPermission !== "default" &&
            notificationPermission !== "granted" && (
              <AppAlert
                icon={<AlertCircleIcon />}
                title="Activar notificaciones"
                variant="info"
              >
                <p>
                  Para recibir alertas importantes sobre su salud en tiempo
                  real, por favor active las notificaciones en la configuración
                  de su navegador.
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
