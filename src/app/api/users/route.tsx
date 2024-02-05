import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function GET(request: Request) {
    const users = await prisma.user.findMany();
    var usersWithoutPassword = [];

    for (const user of users) {
        usersWithoutPassword.push({
            id: user.id,
            name: user.firstname + " " + user.lastname,
            email: user.email,
            position: user.position,
            image: user.image,
        });
    }

    return new NextResponse(JSON.stringify(usersWithoutPassword), {
        status: 201,
    });
}

export async function POST(request: Request) {
    const json = await request.json();
    const hashedPassword = await hash(json.password, 12);
    try {
        await prisma.user.create({
            data: {
                email: json.email,
                firstname: json.firstName,
                lastname: json.lastName,
                position: json.position,
                image: json.image,
                password: hashedPassword,
            },
        });
        return new NextResponse(
            JSON.stringify({
                message: "User Created",
                password: json.password,
            }),
            {
                status: 201,
            }
        );
    } catch (e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                return new NextResponse(
                    JSON.stringify({ error: "Email already exists." }),
                    {
                        status: 501,
                    }
                );
            }
        }
        throw e;
    }
}
