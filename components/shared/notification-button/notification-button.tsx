'use client'

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase'; 

const NotificationButton = () => {

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY }); // Replace with your VAPID key
          console.log('Token:', token);

          // You can send this token to your server to store it for sending push notifications
        }
      } catch (error) {
        console.error('Error getting permission or token:', error);
      }
    };

    requestPermission();

    // Handle incoming messages
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
  }, []);

  return null; // This component doesn't render anything
};

export default NotificationButton;
