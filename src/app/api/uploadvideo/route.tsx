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

    try {
        await writeFile(
            path.join(process.cwd(), "videos/" + file.name),
            buffer
        );
        return new NextResponse(JSON.stringify(file.name), { status: 201 });
    } catch (error) {
        console.log("Error Occurred", error);
        return new NextResponse(
            JSON.stringify({ error: "An Error Occurred" }),
            { status: 500 }
        );
    }
}
