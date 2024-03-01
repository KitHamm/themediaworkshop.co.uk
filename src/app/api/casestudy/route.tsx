import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const json = await request.json();

    switch (json.action) {
        case "create":
            const data = json.data;
            await prisma.caseStudy.create({
                data: data,
            });
            return new NextResponse(JSON.stringify({ message: "Created" }), {
                status: 201,
            });
        case "update":
            await prisma.caseStudy.update({
                where: {
                    id: json.id,
                },
                data: json.data,
            });
            return new NextResponse(JSON.stringify({ message: "Updated" }), {
                status: 201,
            });
        case "publish":
            await prisma.caseStudy.update({
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
            await prisma.caseStudy.delete({
                where: {
                    id: json.id,
                },
            });
            return new NextResponse(JSON.stringify({ message: "Deleted" }), {
                status: 201,
            });

        default:
            return new NextResponse(
                JSON.stringify({ error: "No Action Specified" }),
                { status: 501 }
            );
    }
}
