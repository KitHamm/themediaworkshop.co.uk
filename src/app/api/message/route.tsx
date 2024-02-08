import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
    },

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function POST(request: Request) {
    const json = await request.json();

    const created = await prisma.message.create({
        data: json,
    });

    try {
        const mail = await transporter.sendMail({
            from: "Website",
            to: process.env.SMTP_EMAIL,
            replyTo: process.env.SMTP_EMAIL,
            subject: `New Contact Form Message`,
            html: `
            <p>From: ${json.name} </p>
            <p>Email: ${json.email} </p>
            <p>View the message here: ${
                process.env.NEXTAUTH_URL + "dashboard?view=messages"
            }</p>
            `,
        });

        return new NextResponse(JSON.stringify(created), { status: 201 });
    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({ message: "Could not send message" }),
            { status: 201 }
        );
    }
}

export async function GET(request: Request) {
    revalidatePath("/api/messages");
    const result = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
    });

    return new NextResponse(JSON.stringify(result), { status: 201 });
}
