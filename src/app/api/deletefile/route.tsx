import { NextResponse } from "next/server";
import fs from "fs";
import prisma from "@/lib/prisma";
import { CaseStudy, Page, Segment } from "@prisma/client";

export async function POST(request: Request) {
    const json = await request.json();

    const fileToDelete = json.file;
    const type = json.type;
    const fileName = json.name;

    const segmentHeader: Segment[] = await prisma.segment.findMany({
        where: { headerimage: fileName },
    });
    const segmentImages: Segment[] = await prisma.segment.findMany({
        where: { image: { has: fileName } },
    });
    const caseStudyImages: CaseStudy[] = await prisma.caseStudy.findMany({
        where: { image: { has: fileName } },
    });
    const caseStudyThumbnail: CaseStudy[] = await prisma.caseStudy.findMany({
        where: { videoThumbnail: fileName },
    });
    const pageBackground: Page[] = await prisma.page.findMany({
        where: { backgroundVideo: fileName },
    });
    const pageShowreel: Page[] = await prisma.page.findMany({
        where: { video1: fileName },
    });
    const pageYear: Page[] = await prisma.page.findMany({
        where: { video2: fileName },
    });
    const segmentVideos: Segment[] = await prisma.segment.findMany({
        where: { video: { has: fileName } },
    });
    const caseStudyVideo: CaseStudy[] = await prisma.caseStudy.findMany({
        where: { video: fileName },
    });

    if (segmentHeader.length > 0) {
        return new NextResponse(
            JSON.stringify({ error: segmentHeader, where: "Segment Header" }),
            {
                status: 201,
            }
        );
    }

    if (segmentImages.length > 0) {
        return new NextResponse(
            JSON.stringify({ error: segmentImages, where: "Segment Images" }),
            {
                status: 201,
            }
        );
    }

    if (caseStudyImages.length > 0) {
        return new NextResponse(
            JSON.stringify({
                error: caseStudyImages,
                where: "Case Study Images",
            }),
            {
                status: 201,
            }
        );
    }

    if (caseStudyThumbnail.length > 0) {
        return new NextResponse(
            JSON.stringify({
                error: caseStudyThumbnail,
                where: "Case Study Thumbnail",
            }),
            {
                status: 201,
            }
        );
    }

    if (pageBackground.length > 0) {
        return new NextResponse(
            JSON.stringify({ error: pageBackground, where: "Header Video" }),
            {
                status: 201,
            }
        );
    }

    if (pageShowreel.length > 0) {
        return new NextResponse(
            JSON.stringify({ error: pageShowreel, where: "Page Video" }),
            {
                status: 201,
            }
        );
    }

    if (pageYear.length > 0) {
        return new NextResponse(
            JSON.stringify({ error: pageYear, where: "Page Video" }),
            {
                status: 201,
            }
        );
    }

    if (segmentVideos.length > 0) {
        return new NextResponse(
            JSON.stringify({ error: segmentVideos, where: "Segment Video" }),
            {
                status: 201,
            }
        );
    }

    if (caseStudyVideo.length > 0) {
        return new NextResponse(
            JSON.stringify({
                error: caseStudyVideo,
                where: "Case Study Video",
            }),
            {
                status: 201,
            }
        );
    }

    try {
        if (fileName.split("_")[0] === "LOGO") {
            await prisma.logos.delete({ where: { name: fileName } });
        } else if (type === "image") {
            await prisma.images.delete({
                where: { name: fileName },
            });
        } else {
            await prisma.videos.delete({
                where: { name: fileName },
            });
        }
        fs.unlinkSync(process.cwd() + "/" + fileToDelete);
        return new NextResponse(JSON.stringify({ message: fileName }), {
            status: 201,
        });
    } catch {
        return new NextResponse(JSON.stringify({ error: "Unable to delete" }), {
            status: 501,
        });
    }
}
