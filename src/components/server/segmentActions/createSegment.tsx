"use server";

import { SegmentFormType } from "@/components/dashboard/Segments/Segment";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function CreateSegment(data: SegmentFormType, pageId: number) {
    var images: string[] = [];
    var videos: string[] = [];

    for (let i = 0; i < data.image.length; i++) {
        images.push(data.image[i].url);
    }
    for (let i = 0; i < data.video.length; i++) {
        videos.push(data.video[i].url);
    }
    try {
        await prisma.segment.create({
            data: {
                title: data.title,
                copy: data.copy,
                image: images,
                video: videos,
                headerimage: data.headerImage,
                order: data.order,
                buttonText: data.buttonText,
                linkTo: data.linkTo,
                page: {
                    connect: {
                        id: pageId,
                    },
                },
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/");
    }
}
