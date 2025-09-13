import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return new NextResponse("El id del usuario es obligatorio", {
        status: 400,
      });
    }

    const user = await prismadb.patient.findUnique({
      where: {
        id: userId,
      },
      include: {
        relevantConditions: {
          include: {
            relevantCondition: true,
          },
        },
        medications: {
          include: {
            medication: true,
          },
        },
        doctor: true,
      },
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", {
        status: 404,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_GET]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await req.json();
    const {
      name,
      birthdate,
      gender,
      height,
      weight,
      relevantConditions,
      medications,
    } = body;

    if (!userId) {
      return new NextResponse("El id del usuario es obligatorio", {
        status: 400,
      });
    }

    if (!name) {
      return new NextResponse("El nombre es obligatorio", {
        status: 400,
      });
    }

    if (!birthdate) {
      return new NextResponse("La fecha de nacimiento es obligatoria", {
        status: 400,
      });
    }

    if (!gender) {
      return new NextResponse("El género es obligatorio", {
        status: 400,
      });
    }

    if (!height) {
      return new NextResponse("La altura es obligatoria", {
        status: 400,
      });
    }

    if (!weight) {
      return new NextResponse("El peso es obligatorio", {
        status: 400,
      });
    }

    const user = await prismadb.patient.updateMany({
      where: {
        id: userId,
      },
      data: {
        name,
        birthdate,
        gender,
        height,
        weight,
      },
    });

    await prismadb.patientRelevantConditions.deleteMany({
      where: {
        patientId: userId,
      },
    });
    await prismadb.patientRelevantConditions.createMany({
      data: relevantConditions.map((condition: { id: string }) => ({
        relevantConditionId: condition.id,
        patientId: userId,
      })),
    });

    await prismadb.patientMedications.deleteMany({
      where: {
        patientId: userId,
      },
    });
    await prismadb.patientMedications.createMany({
      data: medications.map((medication: { id: string }) => ({
        medicationId: medication.id,
        patientId: userId,
      })),
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_PATCH]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
