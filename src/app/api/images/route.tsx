import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(request: Request) {
    var preImages: string[] = ["None"];
    var images = fs.readdirSync(
        (process.cwd() + process.env.STATIC_IMAGES) as string
    );
    var result = preImages.concat(images);
    return new NextResponse(JSON.stringify(result), { status: 201 });
}
