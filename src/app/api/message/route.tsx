import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    const created = await prisma.message.create({
        data: json,
    });

    return new NextResponse(JSON.stringify(created), { status: 201 });
}

export async function GET(request: Request) {
    revalidatePath("/api/messages");
    const result = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
    });

    return new NextResponse(JSON.stringify(result), { status: 201 });
}
