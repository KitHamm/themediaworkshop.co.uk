import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    const updated = await prisma.user.update({
        where: {
            id: json.id,
        },
        data: json.data,
    });

    return new NextResponse(JSON.stringify({ message: "Updated" }), {
        status: 201,
    });
}
