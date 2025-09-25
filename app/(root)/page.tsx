"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useAuthStore } from "@/stores/auth/auth.store";
import { messaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";

export default function Home() {
  const router = useRouter();

  const currentUser = useAuthStore((state) => state.user);
  const authenticationStatus = useAuthStore((state) => state.status);

  const { data: session, status } = useSession();

  useEffect(() => {
    // Registrar el service worker
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

    // Pedir permiso para notificaciones y obtener token
    if (messaging) {
      // Escuchar mensajes en primer plano
      onMessage(messaging, (payload) => {
        console.log("Mensaje recibido en foreground:", payload);
        alert(payload.notification?.title || "Nueva notificación");
      });
    }
  }, []);

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
