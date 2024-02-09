import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    const updated = await prisma.caseStudy.delete({
        where: {
            id: json.id,
        },
    });
    return new NextResponse(JSON.stringify(updated), { status: 201 });
}