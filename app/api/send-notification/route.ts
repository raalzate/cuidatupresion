import { NextResponse } from "next/server";
import { adminMessaging } from "@/lib/firebase-admin";

export async function GET(req: Request) {
  try {

    const message = {
      token: "c4ik_v4kA0QcZXcwMw8Db1:APA91bGR0ks9RNsAXczCLjmrjkEUNjRWlZTCBHqahXJzgbH56kGpCQ1HQg0NReZEgJu3CW89f2AvtrfVniTl_I-br9DOg6FW-fA6irtsGkCUyMa1dXkf0eY",
      notification: {
        title: "Notificación de prueba",
        body: "Hola desde Firebase Admin 🚀",
      },
    };

    const response = await adminMessaging.send(message);

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error("Error enviando push:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
