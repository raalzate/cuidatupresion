import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import prismadb from "@/lib/prismadb";

interface JWTPayload {
  userId: string;
  type: string;
  iat: number;
  exp: number;
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token es requerido" },
        { status: 400 }
      );
    }

    let payload: JWTPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      if (payload.type !== "share") {
        throw new Error("Invalid token type");
      }
    } catch {
      return NextResponse.json(
        {
          error: "El enlace ha expirado o no es válido",
          expired: true,
        },
        { status: 401 }
      );
    }

    const measurements = await prismadb.measurements.findMany({
      where: { patientId: payload.userId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const user = await prismadb.patient.findUnique({
      where: { id: payload.userId },
      select: { name: true, email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formattedMeasurements = measurements.map((measurement) => ({
      id: measurement.id,
      heartRate: measurement.heartRate,
      systolicPressure: measurement.systolicPressure,
      diastolicPressure: measurement.diastolicPressure,
      tags: measurement.tags.map((tag) => tag.tag.name).join(", "),
      date: format(measurement.createdAt, "dd/MM/yyyy HH:mm"),
      createdAt: measurement.createdAt,
    }));

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      measurements: formattedMeasurements,
      tokenInfo: {
        userId: payload.userId,
        issuedAt: new Date(payload.iat * 1000),
        expiresAt: new Date(payload.exp * 1000),
      },
    });
  } catch (error) {
    console.error("Error checking shared measurement:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
