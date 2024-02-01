import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    const created = await prisma.page.create({
        data: json,
    });

    return new NextResponse(JSON.stringify(created), { status: 201 });
}
