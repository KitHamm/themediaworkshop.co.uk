import { NextResponse } from "next/server";
import fs from "fs";

export async function POST(request: Request) {
    const json = await request.json();

    const fileToDelete = json.file;

    fs.unlinkSync(process.cwd() + fileToDelete);
    return new NextResponse(JSON.stringify({ message: "No Idea" }), {
        status: 201,
    });
}
