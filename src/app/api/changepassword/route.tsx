import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { compare, hash } from "bcrypt";

export async function POST(request: Request) {
    const json = await request.json();
    const hashedPassword = await hash(json.password, 12);
    const user = await prisma.user.findUnique({
        where: {
            id: json.id,
        },
    });

    const isPasswordValid = await compare(json.currentPassword, user.password);

    if (!isPasswordValid) {
        return new NextResponse(
            JSON.stringify({ error: "Current Password does not match." }),
            {
                status: 201,
            }
        );
    }

    const updated = await prisma.user.update({
        where: {
            id: json.id,
        },
        data: { password: hashedPassword },
    });

    return new NextResponse(JSON.stringify({ message: "Updated" }), {
        status: 201,
    });
}
