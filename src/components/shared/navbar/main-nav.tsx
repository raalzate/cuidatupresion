"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.userId}`,
      label: "Inicio",
      active: pathname === `/${params.userId}`,
    },
    {
      href: `/${params.userId}/history`,
      label: "Historial",
      active: pathname === `/${params.userId}/history`,
    },
    {
      href: `/${params.userId}/settings`,
      label: "Ajustes",
      active: pathname === `/${params.userId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:scape-x-6", className)}>
      {routes.map((route) => (
        <Link
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
          key={route.href}
          href={route.href}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
