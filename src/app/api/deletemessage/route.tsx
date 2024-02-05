import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    const deleted = await prisma.message.delete({
        where: { id: json.id },
    });

    return new NextResponse(JSON.stringify({ message: "Deleted" }), {
        status: 201,
    });
}
