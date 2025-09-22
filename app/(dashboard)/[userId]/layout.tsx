"use client";

import { AlertCircleIcon } from "lucide-react";

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
