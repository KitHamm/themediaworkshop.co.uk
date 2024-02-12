import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    await prisma.emailHost.update({
        where: {
            emailHost: json.old,
        },
        data: json.data,
    });

    return new NextResponse(JSON.stringify({ message: "Updated" }), {
        status: 201,
    });
}
