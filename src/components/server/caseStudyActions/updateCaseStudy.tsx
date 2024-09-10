"use server";

import { CaseStudyFromType } from "@/components/dashboard/CaseStudy/NewCaseStudy";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateCaseStudy(data: CaseStudyFromType, id: number) {
    var images: string[] = [];
    var tags: string[] = [];

    for (let i = 0; i < data.image.length; i++) {
        images.push(data.image[i].url);
    }
    for (let i = 0; i < data.tags.length; i++) {
        tags.push(data.tags[i].text);
    }

    try {
        await prisma.caseStudy.update({
            where: {
                id: id,
            },
            data: {
                title: data.title,
                dateLocation: data.dateLocation,
                copy: data.copy,
                image: images,
                video: data.video,
                videoThumbnail: data.videoThumbnail,
                tags: tags,
                order: data.order,
                segment: {
                    connect: {
                        id: data.segmentId,
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

export async function UpdateCaseStudyPublished(id: number, published: boolean) {
    try {
        await prisma.caseStudy.update({
            where: {
                id: id,
            },
            data: {
                published: published,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/");
    }
}
