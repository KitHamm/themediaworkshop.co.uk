import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();
    const updated = await prisma.segment.update({
        where: {
            id: json.id,
        },
        data: {
            published: json.value,
        },
    });

    return new NextResponse(JSON.stringify({ message: "Updated" }), {
        status: 201,
    });
}
