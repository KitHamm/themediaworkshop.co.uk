import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
    revalidatePath("/api/videos");
    const result = await prisma.videos.findMany();

    return new NextResponse(JSON.stringify(result), { status: 201 });
}
