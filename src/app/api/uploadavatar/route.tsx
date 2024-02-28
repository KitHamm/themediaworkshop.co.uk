import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

interface ArrayFile extends File {
    arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function POST(request: Request) {
    const formData = await request.formData();

    const file = formData.get("file") as ArrayFile;
    if (!file) {
        return new NextResponse(JSON.stringify({ error: "No file received" }), {
            status: 400,
        });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
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
        console.log("Error Occurred", error);
        return new NextResponse(
            JSON.stringify({ error: "An Error Occurred" }),
            { status: 500 }
        );
    }
}
