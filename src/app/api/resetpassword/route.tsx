import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { compare, hash } from "bcrypt";
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
    const hashedPassword = await hash(json.password, 12);
    const adminUser = await prisma.user.findUnique({
        where: {
            id: json.adminId,
        },
    });
    const user = await prisma.user.findUnique({
        where: {
            id: json.id,
        },
    });
    const isPasswordValid = await compare(
        json.adminPassword,
        adminUser.password
    );

    if (!isPasswordValid) {
        return new NextResponse(
            JSON.stringify({ error: "Admin Password does not match." }),
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

    try {
        const mail = await transporter.sendMail({
            from: "TMW Website",
            to: user.email,
            replyTo: process.env.SMTP_EMAIL,
            subject: `Password Reset`,
            html: `
            <p>Your password has been reset by an administrator.</p>
            <p>Sign in with your TMW email address and the following password.</p>
            <p>${json.password}</p>
            <p>Link to sign in: ${process.env.NEXTAUTH_URL + "dashboard"}</p>
            `,
        });

        return new NextResponse(
            JSON.stringify({
                message: "User Updated",
                password: json.password,
            }),
            {
                status: 201,
            }
        );
    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({
                message: "User Created",
                password: json.password,
            }),
            { status: 201 }
        );
    }
}
