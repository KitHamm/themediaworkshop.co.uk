"use server";

import { CaseStudyFromType } from "@/lib/types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCaseStudy(caseStudyData: CaseStudyFromType) {
    const imageUrls = caseStudyData.image.map((img) => img.url);
    const tagTexts = caseStudyData.tags.map((tag) => tag.text);

    try {
        await prisma.caseStudy.create({
            data: {
                title: caseStudyData.title,
                copy: caseStudyData.copy,
                dateLocation: caseStudyData.dateLocation,
                image: imageUrls,
                video: caseStudyData.video,
                videoThumbnail: caseStudyData.videoThumbnail,
                tags: tagTexts,
                order: parseInt(caseStudyData.order.toString()),
                published: caseStudyData.published,
                segmentId: caseStudyData.segmentId,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
        revalidatePath("/", "layout");
    }
}
