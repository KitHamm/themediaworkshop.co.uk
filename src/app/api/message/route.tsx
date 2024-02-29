import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    revalidatePath("/api/messages");
    const result = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
    });

    return new NextResponse(JSON.stringify(result), { status: 201 });
}

export async function POST(request: Request) {
    const json = await request.json();
    switch (json.action) {
        case "delete":
            await prisma.message.deleteMany({
                where: { id: { in: json.id } },
            });

            return new NextResponse(JSON.stringify({ message: "Deleted" }), {
                status: 201,
            });
        case "update":
            await prisma.message.updateMany({
                where: {
                    id: { in: json.id },
                },
                data: {
                    read: json.value,
                },
            });

            return new NextResponse(JSON.stringify({ message: "Updated" }), {
                status: 201,
            });
        default:
            return new NextResponse(
                JSON.stringify({ message: "Invalid action" }),
                {
                    status: 400,
                }
            );
    }
}
