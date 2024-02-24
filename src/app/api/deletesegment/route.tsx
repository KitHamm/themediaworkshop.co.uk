import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    await prisma.caseStudy.deleteMany({ where: { segmentId: json.id } });

    const updated = await prisma.segment.delete({
        where: {
            id: json.id,
        },
    });
    return new NextResponse(JSON.stringify(updated), { status: 201 });
}
