"use server";

import { SegmentFormType } from "@/lib/types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function createSegment(
    segmentData: SegmentFormType,
    pageId: number
) {
    const imageUrls = segmentData.image.map((img) => img.url);
    const videoUrls = segmentData.video.map((video) => video.url);

    try {
        await prisma.segment.create({
            data: {
                title: segmentData.title,
                copy: segmentData.copy,
                image: imageUrls,
                video: videoUrls,
                headerimage: segmentData.headerImage,
                order: parseInt(segmentData.order.toString()),
                buttonText: segmentData.buttonText,
                linkTo: segmentData.linkTo,
                pageId: pageId,
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
