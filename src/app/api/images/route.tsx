import { NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";

export async function GET(request: Request) {
    var preImages: string[] = ["None"];
    var images = await fsp.readdir(
        (process.cwd() + process.env.STATIC_IMAGES) as string
    );
    var result = preImages.concat(images);
    return new NextResponse(JSON.stringify(process.cwd()), { status: 201 });
}
