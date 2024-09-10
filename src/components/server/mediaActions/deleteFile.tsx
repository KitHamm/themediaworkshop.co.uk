"use server";

import prisma from "@/lib/prisma";
import fs from "fs";
import { CaseStudy, Page, Segment } from "@prisma/client";

export type errorResponse = {
    type: string;
    pageTitle?: string;
    segmentTitle?: string;
    caseTitle?: string;
};

export async function DeleteFile(name: string, type: string) {
    var dir = "";

    if (type === "image") {
        if (name.split("_")[0] === "LOGO") {
            dir = process.env.NEXT_PUBLIC_DELETE_LOGO_DIR!;
        } else {
            dir = process.env.NEXT_PUBLIC_DELETE_IMAGE_DIR!;
        }
    } else {
        dir = process.env.NEXT_PUBLIC_DELETE_VIDEO_DIR!;
    }

    var errorResponseArray: errorResponse[] = [];

    const segmentHeader: Segment[] = await prisma.segment.findMany({
        where: { headerimage: name },
    });
    const segmentImages: Segment[] = await prisma.segment.findMany({
        where: { image: { has: name } },
    });
    const caseStudyImages: CaseStudy[] = await prisma.caseStudy.findMany({
        where: { image: { has: name } },
    });
    const caseStudyThumbnail: CaseStudy[] = await prisma.caseStudy.findMany({
        where: { videoThumbnail: name },
    });
    const pageBackground: Page[] = await prisma.page.findMany({
        where: { backgroundVideo: name },
    });
    const pageShowreel: Page[] = await prisma.page.findMany({
        where: { video1: name },
    });
    const pageYear: Page[] = await prisma.page.findMany({
        where: { video2: name },
    });
    const segmentVideos: Segment[] = await prisma.segment.findMany({
        where: { video: { has: name } },
    });
    const caseStudyVideo: CaseStudy[] = await prisma.caseStudy.findMany({
        where: { video: name },
    });

    if (segmentHeader.length > 0) {
        for (let i = 0; i < segmentHeader.length; i++) {
            var locationType = "Segment Header";
            const page = await prisma.page.findUnique({
                where: {
                    id: segmentHeader[i].pageId,
                },
            });
            errorResponseArray.push({
                type: locationType,
                segmentTitle: segmentHeader[i].title!,
                pageTitle: page!.title,
            });
        }
    }
    if (segmentImages.length > 0) {
        for (let i = 0; i < segmentImages.length; i++) {
            var locationType = "Segment Image";
            const page = await prisma.page.findUnique({
                where: {
                    id: segmentImages[i].pageId,
                },
            });

            errorResponseArray.push({
                type: locationType,
                segmentTitle: segmentImages[i].title
                    ? segmentImages[i].title!
                    : "Unnamed",
                pageTitle: page!.title,
            });
        }
    }

    if (caseStudyImages.length > 0) {
        for (let i = 0; i < caseStudyImages.length; i++) {
            var locationType = "Case Study Image";
            const segment = await prisma.segment.findUnique({
                where: {
                    id: caseStudyImages[i].segmentId,
                },
            });
            const page = await prisma.page.findUnique({
                where: {
                    id: segment!.pageId,
                },
            });
            errorResponseArray.push({
                type: locationType,
                caseTitle: caseStudyImages[i].title,
                segmentTitle: segment!.title ? segment!.title! : "Unnamed",
                pageTitle: page!.title,
            });
        }
    }

    if (caseStudyThumbnail.length > 0) {
        for (let i = 0; i < caseStudyThumbnail.length; i++) {
            var locationType = "Case Study Thumbnail";
            const segment = await prisma.segment.findUnique({
                where: {
                    id: caseStudyThumbnail[i].segmentId,
                },
            });
            const page = await prisma.page.findUnique({
                where: {
                    id: segment!.pageId,
                },
            });
            errorResponseArray.push({
                type: locationType,
                caseTitle: caseStudyThumbnail[i].title,
                segmentTitle: segment!.title ? segment!.title! : "Unnamed",
                pageTitle: page!.title,
            });
        }
    }

    if (pageBackground.length > 0) {
        for (let i = 0; i < pageBackground.length; i++) {
            var locationType = "Page Background Video";

            errorResponseArray.push({
                type: locationType,
                pageTitle: pageBackground[i].title,
            });
        }
    }

    if (pageShowreel.length > 0) {
        for (let i = 0; i < pageShowreel.length; i++) {
            var locationType = "Page Video";
            errorResponseArray.push({
                type: locationType,
                pageTitle: pageShowreel[i].title,
            });
        }
    }

    if (pageYear.length > 0) {
        for (let i = 0; i < pageYear.length; i++) {
            var locationType = "Page Video";
            errorResponseArray.push({
                type: locationType,
                pageTitle: pageYear[i].title,
            });
        }
    }

    if (segmentVideos.length > 0) {
        for (let i = 0; i < segmentVideos.length; i++) {
            var locationType = "Segment Video";
            const page = await prisma.page.findUnique({
                where: {
                    id: segmentVideos[i].pageId,
                },
            });
            errorResponseArray.push({
                type: locationType,
                segmentTitle: segmentVideos[i].title
                    ? segmentVideos[i].title!
                    : "Unnamed",
                pageTitle: page!.title,
            });
        }
    }

    if (caseStudyVideo.length > 0) {
        for (let i = 0; i < caseStudyVideo.length; i++) {
            var locationType = "Case Study Video";
            const segment = await prisma.segment.findUnique({
                where: {
                    id: caseStudyVideo[i].segmentId,
                },
            });
            const page = await prisma.page.findUnique({
                where: {
                    id: segment!.pageId,
                },
            });
            errorResponseArray.push({
                type: locationType,
                caseTitle: caseStudyVideo[i].title,
                segmentTitle: segment!.title ? segment!.title! : "Unnamed",
                pageTitle: page!.title,
            });
        }
    }
    if (errorResponseArray.length > 0) {
        return Promise.resolve({
            status: 201,
            message: JSON.stringify(errorResponseArray),
        });
    }

    try {
        if (type === "image") {
            if (name.split("_")[0] === "LOGO") {
                await prisma.logos.delete({ where: { name: name } });
            } else {
                await prisma.images.delete({
                    where: { name: name },
                });
            }
        } else {
            await prisma.videos.delete({
                where: { name: name },
            });
        }
        fs.unlinkSync(process.cwd() + "/" + dir + name);
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    }
}
