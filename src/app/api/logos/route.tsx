import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
    revalidatePath("/api/images");
    const result = await prisma.logos.findMany({
        orderBy: { createdAt: "desc" },
    });
    return new NextResponse(JSON.stringify(result), { status: 201 });
}
