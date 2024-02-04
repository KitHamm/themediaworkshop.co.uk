import { NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";

export async function GET(request: Request) {
    var preImages: string[] = ["None"];
    // var images = await fsp.readdir(
    //     (process.cwd() + process.env.STATIC_IMAGES) as string
    var images = await fsp.readdir(
        process.env.NEXT_PUBLIC_BASE_IMAGE_URL as string
    );
    var result = preImages.concat(images);
    return new NextResponse(JSON.stringify(result), { status: 201 });
}
