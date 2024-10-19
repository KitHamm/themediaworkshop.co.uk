"use server";

import prisma from "@/lib/prisma";
import fs from "fs";
import { CaseStudy, Page, Segment } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type errorResponse = {
    type: string;
    pageTitle?: string;
    segmentTitle?: string;
    caseTitle?: string;
};

interface SegmentWithPage extends Segment {
    page: Page;
}

interface CaseStudyWithSegmentAndPage extends CaseStudy {
    segment: SegmentWithPage;
}

export async function deleteFile(name: string, type: string) {
    const dir =
        type === "image" ? getImagesDirectory(name) : getVideosDirectory();

    var errorResponseArray: errorResponse[] = [];

    const segmentHeader: SegmentWithPage[] = await prisma.segment.findMany({
        where: { headerimage: name },
        include: { page: true },
    });
    const segmentImages: SegmentWithPage[] = await prisma.segment.findMany({
        where: { image: { has: name } },
        include: { page: true },
    });
    const caseStudyImages: CaseStudyWithSegmentAndPage[] =
        await prisma.caseStudy.findMany({
            where: { image: { has: name } },
            include: {
                segment: {
                    include: { page: true },
                },
            },
        });
    const caseStudyThumbnail: CaseStudyWithSegmentAndPage[] =
        await prisma.caseStudy.findMany({
            where: { videoThumbnail: name },
            include: {
                segment: {
                    include: { page: true },
                },
            },
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
    const segmentVideos: SegmentWithPage[] = await prisma.segment.findMany({
        where: { video: { has: name } },
        include: { page: true },
    });
    const caseStudyVideo: CaseStudyWithSegmentAndPage[] =
        await prisma.caseStudy.findMany({
            where: { video: name },
            include: {
                segment: {
                    include: { page: true },
                },
            },
        });

    segmentHeader.forEach((segment: SegmentWithPage) => {
        errorResponseArray.push({
            type: "Segment Header",
            segmentTitle: segment.title || "Unnamed",
            pageTitle: segment.page!.title,
        });
    });

    segmentImages.forEach((segment: SegmentWithPage) => {
        errorResponseArray.push({
            type: "Segment Image",
            segmentTitle: segment.title || "Unnamed",
            pageTitle: segment.page!.title,
        });
    });

    caseStudyImages.forEach((caseStudy: CaseStudyWithSegmentAndPage) => {
        errorResponseArray.push({
            type: "Case Study Image",
            caseTitle: caseStudy.title || "Unnamed",
            segmentTitle: caseStudy.segment.title || "Unnamed",
            pageTitle: caseStudy.segment.page!.title,
        });
    });

    caseStudyThumbnail.forEach((caseStudy: CaseStudyWithSegmentAndPage) => {
        errorResponseArray.push({
            type: "Case Study Thumbnail",
            caseTitle: caseStudy.title || "Unnamed",
            segmentTitle: caseStudy.segment.title || "Unnamed",
            pageTitle: caseStudy.segment.page!.title,
        });
    });

    pageBackground.forEach((page: Page) => {
        errorResponseArray.push({
            type: "Page Background Video",
            pageTitle: page.title,
        });
    });

    pageShowreel.forEach((page: Page) => {
        errorResponseArray.push({
            type: "Page Video",
            pageTitle: page.title,
        });
    });

    pageYear.forEach((page: Page) => {
        errorResponseArray.push({
            type: "Page Video",
            pageTitle: page.title,
        });
    });

    segmentVideos.forEach((segment: SegmentWithPage) => {
        errorResponseArray.push({
            type: "Segment Video",
            segmentTitle: segment.title || "Unnamed",
            pageTitle: segment.page!.title,
        });
    });

    caseStudyVideo.forEach((caseStudy: CaseStudyWithSegmentAndPage) => {
        errorResponseArray.push({
            type: "Case Study Video",
            caseTitle: caseStudy.title || "Unnamed",
            segmentTitle: caseStudy.segment.title || "Unnamed",
            pageTitle: caseStudy.segment.page!.title,
        });
    });

    if (errorResponseArray.length > 0) {
        return Promise.reject(new Error(JSON.stringify(errorResponseArray)));
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
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
    }
}

function getImagesDirectory(name: string): string {
    return name.split("_")[0] === "LOGO"
        ? process.env.NEXT_PUBLIC_DELETE_LOGO_DIR!
        : process.env.NEXT_PUBLIC_DELETE_IMAGE_DIR!;
}

function getVideosDirectory(): string {
    return process.env.NEXT_PUBLIC_DELETE_VIDEO_DIR!;
}
