"use server";

import { CaseStudyFromType } from "@/lib/types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCaseStudy(
    caseStudyData: CaseStudyFromType,
    id: number
) {
    const imageUrls = caseStudyData.image.map((img) => img.url);
    const tagTexts = caseStudyData.tags.map((tag) => tag.text);

    try {
        await prisma.caseStudy.update({
            where: {
                id: id,
            },
            data: {
                title: caseStudyData.title,
                dateLocation: caseStudyData.dateLocation,
                copy: caseStudyData.copy,
                image: imageUrls,
                video: caseStudyData.video,
                videoThumbnail: caseStudyData.videoThumbnail,
                tags: tagTexts,
                order: parseInt(caseStudyData.order.toString()),
                segmentId: caseStudyData.segmentId,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
        revalidatePath("/", "layout");
    }
}

export async function updateCaseStudyPublished(id: number, published: boolean) {
    try {
        await prisma.caseStudy.update({
            where: {
                id: id,
            },
            data: {
                published: published,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard/pages", "layout");
        revalidatePath("/", "layout");
    }
}
