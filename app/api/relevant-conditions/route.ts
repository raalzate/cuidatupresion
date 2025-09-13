import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const relevantConditions = await prismadb.relevantConditions.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(relevantConditions);
  } catch (error) {
    console.log("[RELEVANT_CONDITIONS_GET]", error);

    return new NextResponse("Internal error", { status: 500 });
  }
}
