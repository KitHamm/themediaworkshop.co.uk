import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();
    const user = await prisma.user.findUnique({ where: { id: json.id } });

    if (!user) {
        return new NextResponse(JSON.stringify({ error: "User Not Found" }), {
            status: 501,
        });
    }

    return new NextResponse(JSON.stringify({ activated: user.activated }), {
        status: 200,
    });
}
