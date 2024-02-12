import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();
    const updated = await prisma.message.updateMany({
        where: {
            id: { in: json.id },
        },
        data: {
            read: json.value,
        },
    });

    return new NextResponse(JSON.stringify({ message: "Updated" }), {
        status: 201,
    });
}
