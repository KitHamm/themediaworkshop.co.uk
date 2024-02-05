import { NextResponse } from "next/server";
import fs from "fs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    const json = await request.json();

    const fileToDelete = json.file;
    const type = json.type;
    const fileName = json.name;

    try {
        if (type === "image") {
            await prisma.images.delete({
                where: { name: fileName },
            });
        } else {
            await prisma.videos.delete({
                where: { name: fileName },
            });
        }
        fs.unlinkSync(process.cwd() + "/" + fileToDelete);
        return new NextResponse(JSON.stringify({ message: fileName }), {
            status: 201,
        });
    } catch {
        return new NextResponse(JSON.stringify({ error: "Unable to delete" }), {
            status: 501,
        });
    }
}
