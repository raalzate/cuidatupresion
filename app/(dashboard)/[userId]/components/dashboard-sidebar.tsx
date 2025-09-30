"use client";

import { useAuthStore } from "@/stores/auth/auth.store";
import { AppSidebar } from "../../../../components/shared/sidebar/sidebar";
import { Stethoscope } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserProps {
  email: string;
  avatar: string;
  name: string;
  id: string;
}

const data = {
  navMain: [
    {
      title: "Info",
      url: "#",
      icon: Stethoscope,
      isActive: true,
      items: [
        {
          title: "Medición",
          url: "/measurement",
        },

        {
          title: "Historica",
          url: "/history",
        },

        {
          title: "Grafica Historica",
          url: "/graph",
        },
      ],
    },
  ],
};

export function DashboardSidebar() {
  const { data: session, status } = useSession();
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.id ?? "";
  const [user, setUser] = useState<UserProps>({
    email: "",
    avatar: "",
    name: "",
    id: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      setUser({
        email: session?.user?.email ?? "",
        avatar: session?.user?.image ?? "",
        name: session?.user?.name ?? "",
        id: currentUser?.id ?? "",
      });
    }
  }, [status, session, currentUser?.id]);

  data.navMain[0].items[0].url = `/${userId}/measurement`;
  data.navMain[0].items[1].url = `/${userId}/history`;
  data.navMain[0].items[2].url = `/${userId}/graph`;

  return <AppSidebar user={user} navMain={data.navMain} />;
}
