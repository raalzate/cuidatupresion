"use client";

import { Bell, ChevronsUpDown, LogOut, Settings2 } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./sidebar";
import { useAuthStore } from "@/stores/auth/auth.store";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    id: string;
  };
}) {
  const { isMobile } = useSidebar();
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleLogOut = () => {
    logoutUser();
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-12 w-12 rounded-xl">
                <AvatarImage src={user.avatar} alt={user.name} />

                <AvatarFallback className="rounded-xl text-base font-bold">
                  CN
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-base leading-tight text-[var(--sidebar-foreground)]">
                <span className="truncate font-bold">{user.name}</span>

                <span className="truncate text-sm font-semibold text-[rgba(30,86,49,0.85)]">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-5" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-2 text-left text-base text-[var(--foreground)]">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarImage src={user.avatar} alt={user.name} />

                  <AvatarFallback className="rounded-xl text-base font-bold">
                    CN
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-base leading-tight">
                  <span className="truncate font-bold">{user.name}</span>

                  <span className="truncate text-sm font-semibold text-[rgba(33,37,41,0.75)]">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={`/${user.id}/profile`}>
                  <Settings2 />
                  Actualizar datos
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={`/${user.id}/notifications`}>
                  <Bell />
                  Recordatorios
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogOut}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
