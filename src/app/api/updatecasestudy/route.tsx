import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    const updated = await prisma.caseStudy.update({
        where: {
            id: json.id,
        },
        data: json.data,
    });
    return new NextResponse(JSON.stringify(updated), { status: 201 });
}
