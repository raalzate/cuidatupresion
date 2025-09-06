"use client";

import { AppSidebar } from "../../../../components/shared/sidebar/sidebar";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserProps {
  email: string;
  avatar: string;
  name: string;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limitsss",
          url: "#",
        },
      ],
    },
  ],
};

export function DashboardSidebar() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProps>({
    email: "",
    avatar: "",
    name: "",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated") {
      setUser({
        email: session?.user?.email ?? "",
        avatar: session?.user?.image ?? "",
        name: session?.user?.name ?? "",
      });
    }
  }, [status, session]);

  return <AppSidebar user={user} navMain={data.navMain} />;
}
