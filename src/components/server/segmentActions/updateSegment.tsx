"use server";

import { SegmentFormType } from "@/components/dashboard/Segments/Segment";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSegment(data: SegmentFormType) {
    const imageUrls = data.image.map((img) => img.url);
    const videoUrls = data.video.map((video) => video.url);

    try {
        const updatedSegment = await prisma.segment.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                copy: data.copy,
                image: imageUrls,
                video: videoUrls,
                headerimage: data.headerImage,
                order: data.order,
                buttonText: data.buttonText,
                linkTo: data.linkTo,
            },
        });
        return { message: JSON.stringify(updatedSegment) };
    } catch (error: any) {
        throw new Error(error);
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function updateSegmentPublish(id: number, published: boolean) {
    try {
        await prisma.segment.update({
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
        revalidatePath("/dashboard");
    }
}
