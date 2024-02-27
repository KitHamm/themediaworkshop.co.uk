import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    // await prisma.caseStudy.deleteMany({ where: { segmentId: json.id } });
    try {
        const updated = await prisma.segment.delete({
            where: {
                id: json.id,
            },
        });
        return new NextResponse(JSON.stringify(updated), { status: 201 });
    } catch (err: any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2003") {
                return new NextResponse(
                    JSON.stringify({ error: "Segment has Case Studies" }),
                    { status: 501 }
                );
            }
        } else {
            return new NextResponse(
                JSON.stringify({ error: "Unknown Error" }),
                { status: 501 }
            );
        }
    }
}
