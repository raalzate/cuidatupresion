import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const user = await prismadb.patient.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_GET]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { doctorAccessCode, email, name } = body;

    if (!email) {
      return new NextResponse("El correo electrónico es requerido", {
        status: 400,
      });
    }

    if (!name) {
      return new NextResponse("El nombre es requerido", {
        status: 400,
      });
    }

    if (!doctorAccessCode) {
      return new NextResponse("El código de acceso del doctor es requerido", {
        status: 400,
      });
    }

    const existingUser = await prismadb.patient.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("El usuario ya existe", { status: 400 });
    }

    const doctor = await prismadb.doctor.findUnique({
      where: {
        accessCode: doctorAccessCode,
      },
    });

    if (!doctor) {
      return new NextResponse("Código de acceso del doctor inválido", {
        status: 400,
      });
    }

    const newUser = await prismadb.patient.create({
      data: {
        doctorId: doctor.id,
        email,
        name,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.log("[USERS_POST]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
