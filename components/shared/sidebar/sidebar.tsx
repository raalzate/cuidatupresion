"use client";

import * as React from "react";
import { HeartPlus, LucideProps } from "lucide-react";

import { AppInfo } from "../app-info/app-info";
import { NavMain } from "../../ui/nav-main";
import { NavUser } from "../../ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../../ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
    id: string;
  };
  navMain: Array<{
    title: string;
    url: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    isActive?: boolean;
    items: {
      title: string;
      url: string;
    }[];
  }>;
}

const data = {
  name: "Cuida tu presión",
  logo: HeartPlus,
  plan: "Salud cardiovascular",
};

export const AppSidebar = ({ user, navMain, ...props }: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppInfo data={data} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
