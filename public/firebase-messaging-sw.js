// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js");

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

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Mensaje en background:", payload);

  const notificationTitle = payload.notification?.title || "Nueva notificación";
  const notificationOptions = {
    body: payload.notification?.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});