import { NextResponse } from "next/server";
import fs from "fs";

export async function GET(request: Request) {
    var bgVideos: string[] = ["None"];
    var videos = fs.readdirSync(process.env.STATIC_VIDEOS as string);
    var temp = bgVideos.concat(videos);
    return new NextResponse(JSON.stringify(temp), { status: 201 });
}