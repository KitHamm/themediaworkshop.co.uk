import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();
    try {
        await prisma.serviceRequest.create({
            data: {
                page: json.page,
            },
        });
        return new NextResponse(JSON.stringify({ response: 200 }), {
            status: 201,
        });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ response: 200 }), {
            status: 501,
        });
    }
}

export async function GET(request: Request) {
    const response = await prisma.serviceRequest.findMany();
    return new NextResponse(JSON.stringify({ data: response }), {
        status: 201,
    });
}
