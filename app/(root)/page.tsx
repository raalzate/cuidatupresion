"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useAuthStore } from "@/stores/auth/auth.store";

export default function Home() {
  const router = useRouter();

  const currentUser = useAuthStore((state) => state.user);
  const authenticationStatus = useAuthStore((state) => state.status);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status === "authenticated" &&
      authenticationStatus === "authenticated" &&
      currentUser &&
      currentUser.email === session.user?.email
    ) {
      router.push(`/${currentUser.id}/profile`);
    } else {
      router.push("/sign-in");
    }
  }, [status, authenticationStatus, currentUser, session, router]);

  return <></>;
}
