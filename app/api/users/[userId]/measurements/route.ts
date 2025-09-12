import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Corregido: de measurements a measurement
    const measurements = await prismadb.measurements.findMany({
      where: {
        patientId: params.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(measurements);
  } catch (error) {
    console.log('[MEASUREMENTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    if (!params.userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    const body = await req.json();
    const { systolicPressure, diastolicPressure, heartRate } = body;

    if (!systolicPressure) {
      return new NextResponse('Systolic pressure is required', { status: 400 });
    }

    if (!diastolicPressure) {
      return new NextResponse('Diastolic pressure is required', { status: 400 });
    }

    if (!heartRate) {
      return new NextResponse('Heart rate is required', { status: 400 });
    }

    const measurement = await prismadb.measurements.create({
      data: {
        systolicPressure,
        diastolicPressure,
        heartRate,
        patientId: params.userId,
      },
    });

    return NextResponse.json(measurement);
  } catch (error) {
    console.log('[MEASUREMENTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
