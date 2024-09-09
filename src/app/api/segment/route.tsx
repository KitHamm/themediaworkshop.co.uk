import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    switch (json.action) {
        case "create":
            await prisma.segment.create({
                data: json.data,
            });
            return new NextResponse(JSON.stringify({ message: "Created" }), {
                status: 201,
            });
    }
}
