import { NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";

export async function GET(request: Request) {
    var bgVideos: string[] = ["None"];
    var videos = await fsp.readdir(
        (process.cwd() + process.env.STATIC_VIDEOS) as string
    );
    var temp = bgVideos.concat(videos);
    return new NextResponse(JSON.stringify(temp), { status: 201 });
}
