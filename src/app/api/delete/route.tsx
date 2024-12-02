import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { Page, Segment, CaseStudy } from "@prisma/client";
import { errorResponse } from "@/lib/types";

interface SegmentWithPage extends Segment {
    page: Page;
}

interface CaseStudyWithSegmentAndPage extends CaseStudy {
    segment: SegmentWithPage;
}

const bucketName = process.env.SPACES_BUCKET_NAME!;
const endpoint = process.env.SPACES_ENDPOINT!;
const region = process.env.SPACES_REGION!;
const accessKeyId = process.env.SPACES_ACCESS_KEY!;
const secretAccessKey = process.env.SPACES_SECRET_KEY!;

const s3 = new S3Client({
    region,
    endpoint,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export async function POST(req: Request) {
    const { fileName } = await req.json();

    if (!fileName) {
        return NextResponse.json(
            { error: "File path is required" },
            { status: 400 }
        );
    }
    var errorResponseArray: errorResponse[] = [];

    const segmentHeader: SegmentWithPage[] = await prisma.segment.findMany({
        where: { headerimage: fileName },
        include: { page: true },
    });
    const segmentImages: SegmentWithPage[] = await prisma.segment.findMany({
        where: { image: { has: fileName } },
        include: { page: true },
    });
    const caseStudyImages: CaseStudyWithSegmentAndPage[] =
        await prisma.caseStudy.findMany({
            where: { image: { has: fileName } },
            include: {
                segment: {
                    include: { page: true },
                },
            },
        });
    const caseStudyThumbnail: CaseStudyWithSegmentAndPage[] =
        await prisma.caseStudy.findMany({
            where: { videoThumbnail: fileName },
            include: {
                segment: {
                    include: { page: true },
                },
            },
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
    const segmentVideos: SegmentWithPage[] = await prisma.segment.findMany({
        where: { video: { has: fileName } },
        include: { page: true },
    });
    const caseStudyVideo: CaseStudyWithSegmentAndPage[] =
        await prisma.caseStudy.findMany({
            where: { video: fileName },
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
        return NextResponse.json(
            { error: errorResponseArray },
            { status: 500 }
        );
    }

    try {
        var folder = "";
        const prefix = fileName.split("_")[0];
        switch (prefix) {
            case "SEGHEAD":
            case "SEGMENT":
            case "STUDY":
            case "THUMBNAIL":
                folder = "images/";
                break;
            case "VIDEO":
            case "HEADER":
                folder = "videos/";
                break;
            case "LOGO":
                folder = "logos/";
                break;
            default:
                folder = "avatars/";
        }

        const filePath = folder + fileName;

        const deleteParams = {
            Bucket: bucketName,
            Key: filePath,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));

        if (prefix === "VIDEO" || prefix === "HEADER") {
            const posterName = fileName.split(".")[0] + ".webp";
            const posterPath = "videos/posters/" + posterName;

            const deletePosterParams = {
                Bucket: bucketName,
                Key: posterPath,
            };

            await s3.send(new DeleteObjectCommand(deletePosterParams));
        }
        try {
            switch (prefix) {
                case "SEGHEAD":
                case "SEGMENT":
                case "STUDY":
                case "THUMBNAIL":
                    await prisma.images.delete({
                        where: {
                            name: fileName,
                        },
                    });
                    break;
                case "VIDEO":
                case "HEADER":
                    await prisma.videos.delete({
                        where: {
                            name: fileName,
                        },
                    });
                    break;
                case "LOGO":
                    await prisma.logos.delete({
                        where: {
                            name: fileName,
                        },
                    });
                    break;
            }
            return NextResponse.json(
                { message: "File deleted successfully" },
                {
                    status: 200,
                }
            );
        } catch (error) {
            return NextResponse.json(
                { error: "Failed to remove from database" },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: "File deletion failed" },
            { status: 500 }
        );
    }
}
