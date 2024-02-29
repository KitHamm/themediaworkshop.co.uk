import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { writeFile } from "fs/promises";

interface ArrayFile extends File {
    arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function GET(request: Request) {
    revalidatePath("/api/video");
    const result = await prisma.videos.findMany({
        orderBy: { createdAt: "desc" },
    });

    return new NextResponse(JSON.stringify(result), { status: 201 });
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as ArrayFile;
    const date = new Date();
    if (!file) {
        return new NextResponse(JSON.stringify({ error: "No file received" }), {
            status: 400,
        });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.split(".")[0].replace(" ", "-");
    const extension = file.name.split(".")[1];
    const formattedDate = date.toISOString().replace(/:|\./g, "-");
    const formattedName =
        fileName.replace(" ", "_") + "-" + formattedDate + "." + extension;
    try {
        await writeFile(
            path.join(
                process.cwd(),
                process.env.PUT_STATIC_VIDEOS + formattedName
            ),
            buffer
        );
        try {
            await prisma.videos.create({
                data: {
                    name: formattedName,
                },
            });
            return new NextResponse(
                JSON.stringify({ message: formattedName }),
                { status: 201 }
            );
        } catch {
            return new NextResponse(
                JSON.stringify({ error: "An Error Occurred" }),
                { status: 500 }
            );
        }
    } catch (error) {
        console.log("Error Occurred", error);
        return new NextResponse(
            JSON.stringify({ error: "An Error Occurred" }),
            { status: 500 }
        );
    }
}
