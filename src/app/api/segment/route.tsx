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
        case "update":
            await prisma.segment.update({
                where: {
                    id: json.id,
                },
                data: json.data,
            });
            return new NextResponse(JSON.stringify({ message: "Updated" }), {
                status: 201,
            });
        case "publish":
            await prisma.segment.update({
                where: {
                    id: json.id,
                },
                data: {
                    published: json.value,
                },
            });
            return new NextResponse(JSON.stringify({ message: "Published" }), {
                status: 201,
            });
        case "delete":
            try {
                await prisma.segment.delete({
                    where: {
                        id: json.id,
                    },
                });
                return new NextResponse(
                    JSON.stringify({ message: "Deleted" }),
                    { status: 201 }
                );
            } catch (err: any) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    if (err.code === "P2003") {
                        return new NextResponse(
                            JSON.stringify({
                                error: "Segment has Case Studies",
                            }),
                            { status: 201 }
                        );
                    }
                } else {
                    return new NextResponse(
                        JSON.stringify({ error: "Unknown Error" }),
                        { status: 501 }
                    );
                }
            }
        default:
            return new NextResponse(
                JSON.stringify({ error: "No Action Specified" }),
                {
                    status: 501,
                }
            );
    }
}
