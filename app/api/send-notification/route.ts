import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";

export async function GET() {
  try {

    const message = {
      token: "eiQEVzcZD8LEZ2QlPft7yI:APA91bHYnNvtir4pOkB0hOeWCxW4nJc6uCgjLdThPMQdvdMhyKXYRjtkSmxQXNgdkOMHfEsvVSoKXw67AbsuUDW_-1h5Sk8yflEG_tdNnaUFRIfqYjsl4S0",
      notification: {
        title: "Notificación de prueba",
        body: "Hola desde Firebase Admin 🚀",
      },
    };

    const response = await adminMessaging.send(message);

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error enviando push:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
