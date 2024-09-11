"yse server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { writeFile } from "fs/promises";

interface ArrayFile extends File {
    arrayBuffer: () => Promise<ArrayBuffer>;
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
    const type = file.name.split("_")[0];
    const extension = file.name.split(".")[1];
    const formattedDate = date.toISOString().replace(/:|\./g, "-");
    const formattedName =
        fileName.replace(" ", "_") + "-" + formattedDate + "." + extension;
    switch (type) {
        case "THUMBNAIL":
        case "STUDY":
        case "SEGMENT":
        case "SEGHEAD":
            try {
                await writeFile(
                    path.join(
                        process.cwd(),
                        process.env.PUT_STATIC_IMAGES + formattedName
                    ),
                    buffer
                );
                try {
                    await prisma.images.create({
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
                } finally {
                    revalidatePath("/dashboard");
                }
            } catch (error) {
                return new NextResponse(
                    JSON.stringify({ error: "An Error Occurred" }),
                    { status: 500 }
                );
            } finally {
                revalidatePath("/dashboard");
            }
        case "LOGO":
            try {
                await writeFile(
                    path.join(
                        process.cwd(),
                        process.env.PUT_STATIC_LOGOS + formattedName
                    ),
                    buffer
                );
                try {
                    await prisma.logos.create({
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
                } finally {
                    revalidatePath("/dashboard");
                }
            } catch (error) {
                return new NextResponse(
                    JSON.stringify({ error: "An Error Occurred" }),
                    { status: 500 }
                );
            } finally {
                revalidatePath("/dashboard");
            }
        default:
            const formattedFileName = file.name.replace(" ", "_");
            try {
                await writeFile(
                    path.join(
                        process.cwd(),
                        process.env.PUT_STATIC_AVATARS + formattedFileName
                    ),
                    buffer
                );
                return new NextResponse(
                    JSON.stringify({ message: formattedFileName }),
                    {
                        status: 201,
                    }
                );
            } catch (error) {
                return new NextResponse(
                    JSON.stringify({ error: "An Error Occurred" }),
                    { status: 500 }
                );
            } finally {
                revalidatePath("/dashboard");
            }
    }
}
