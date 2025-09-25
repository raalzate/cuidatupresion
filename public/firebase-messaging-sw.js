// public/firebase-messaging-sw.js

// 1. Importa versiones más recientes de Firebase para mejor rendimiento y seguridad
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyA_436T2s2JxMCar0LwrWZBkkYZPfivvq0",
  authDomain: "cuidatupresion-7262c.firebaseapp.com",
  projectId: "cuidatupresion-7262c",
  storageBucket: "cuidatupresion-7262c.appspot.com",
  messagingSenderId: "560105761101",
  appId: "1:560105761101:web:d606221bf114f282af6f04",
  measurementId: "G-3J3CGEWV6Y",
});

const messaging = firebase.messaging();

// 2. Escucha los mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Mensaje en background:", payload);


  const notificationTitle = payload.data?.title || "Nueva Alerta de Salud";
  const notificationOptions = {
    body: payload.data?.body || "Revisa tus últimos registros.",
    icon: payload.data?.icon || "/icons/icon-192x192.png", // Ícono principal de la notificación
    image: payload.data?.image, // Una imagen grande y llamativa (opcional)
    badge: "/icons/badge-72x72.png", // Ícono para la barra de estado en móviles
    
    // Acciones (botones) para interactividad
    actions: [
      {
        action: "view-details",
        title: "Ver detalles",
        icon: "/icons/actions/view.png", // Icono para el botón (opcional)
      },
      {
        action: "dismiss",
        title: "Ignorar",
        icon: "/icons/actions/dismiss.png", // Icono para el botón (opcional)
      },
    ],

    data: {
      url: payload.data?.url || "/", // URL a la que redirigir
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  console.log("Se hizo clic en la notificación:", event);

  event.notification.close();

  const urlToOpen = event.notification.data.url;

  if (event.action === "view-details") {
    event.waitUntil(
      clients.openWindow(urlToOpen).then((windowClient) => {
        if (windowClient) {
          windowClient.focus();
        }
      })
    );
  } else if (event.action === "dismiss") {
    console.log("Notificación ignorada.");
  } else {
    event.waitUntil(
      clients.openWindow(urlToOpen).then((windowClient) => {
        if (windowClient) {
          windowClient.focus();
        }
      })
    );
  }
});