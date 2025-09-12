import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { ADDITIONAL_TAGS } from "@/config/config";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const body = await req.json();
    const { userId } = await params;
    const { diastolicPressure, systolicPressure, heartRate, tags } = body;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    if (!diastolicPressure || !systolicPressure || !heartRate) {
      return new NextResponse("All pressure and heart rate values are required", { status: 400 });
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return new NextResponse("At least one tag is required", { status: 400 });
    }

    // Validate that all tags are from the allowed ADDITIONAL_TAGS
    const invalidTags = tags.filter((tag: string) => !ADDITIONAL_TAGS.includes(tag));
    if (invalidTags.length > 0) {
      return new NextResponse(`Invalid tags: ${invalidTags.join(", ")}`, { status: 400 });
    }

    // Verify that the patient exists
    const patient = await prismadb.patient.findUnique({
      where: { id: userId },
    });

    if (!patient) {
      return new NextResponse("Patient not found", { status: 404 });
    }

    // Create or find tags for the selected tags
    const tagsData = await Promise.all(
      tags.map(async (tagName: string) => {
        const tag = await prismadb.tags.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        return tag;
      })
    );

    // Create the measurement record with tag relations
    const measurement = await prismadb.measurements.create({
      data: {
        patientId: userId,
        diastolicPressure: parseInt(diastolicPressure),
        systolicPressure: parseInt(systolicPressure),
        heartRate: parseInt(heartRate),
        tags: {
          create: tagsData.map((tag) => ({
            tagId: tag.id,
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(measurement);
  } catch (error) {
    console.log("[MEASUREMENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}