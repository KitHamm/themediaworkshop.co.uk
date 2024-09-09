"use server";

import { SegmentFormType } from "@/components/dashboard/Segments/Segment";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateSegment(data: SegmentFormType) {
    var images: string[] = [];
    var videos: string[] = [];

    for (let i = 0; i < data.image.length; i++) {
        images.push(data.image[i].url);
    }
    for (let i = 0; i < data.video.length; i++) {
        videos.push(data.video[i].url);
    }

    try {
        const segment = await prisma.segment.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                copy: data.copy,
                image: images,
                video: videos,
                headerimage: data.headerImage,
                order: data.order,
                buttonText: data.buttonText,
                linkTo: data.linkTo,
            },
        });
        return Promise.resolve({
            status: 200,
            message: JSON.stringify(segment),
        });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function UpdateSegmentPublish(id: number, published: boolean) {
    try {
        await prisma.segment.update({
            where: {
                id: id,
            },
            data: {
                published: published,
            },
        });
        return Promise.resolve({ status: 200, message: published });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
