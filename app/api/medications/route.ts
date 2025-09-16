import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const medications = await prismadb.medications.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(medications);
  } catch (error) {
    console.log("[MEDICATIONS_GET]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
