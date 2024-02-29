import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();
    switch (json.action) {
        case "update":
            const updated = await prisma.page.update({
                where: {
                    id: json.id,
                },
                data: json.data,
            });
            return new NextResponse(JSON.stringify(updated), { status: 201 });
        case "create":
            const created = await prisma.page.create({
                data: json.data,
            });
            return new NextResponse(JSON.stringify(created), { status: 201 });
        default:
            return new NextResponse(
                JSON.stringify({ error: "Action was not specified" }),
                { status: 501 }
            );
    }
}
