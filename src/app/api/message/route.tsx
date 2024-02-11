import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    revalidatePath("/api/messages");
    const result = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
    });

    return new NextResponse(JSON.stringify(result), { status: 201 });
}
