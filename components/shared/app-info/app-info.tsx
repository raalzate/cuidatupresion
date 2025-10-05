"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

interface AppInfoProps {
  data: {
    name: string;
    logo: React.ElementType;
    plan: string;
  };
}

export const AppInfo: React.FC<AppInfoProps> = ({ data }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-xl shadow-sm ring-2 ring-[rgba(30,86,49,0.35)]">
            <data.logo className="size-6" />
          </div>

          <div className="grid flex-1 text-left text-base leading-snug text-[var(--sidebar-foreground)]">
            <span className="truncate font-bold">{data.name}</span>

            <span className="truncate text-sm font-semibold text-[rgba(30,86,49,0.85)]">
              {data.plan}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
