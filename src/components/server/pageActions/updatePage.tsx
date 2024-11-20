"use server";

import { PageFormType } from "@/components/dashboard/Pages/PageEdit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePage(data: PageFormType) {
    try {
        const updatedPage = await prisma.page.update({
            where: {
                title: data.page,
            },
            data: {
                subTitle: data.subTitle,
                description: data.description,
                header: data.header,
                video1: data.video1,
                video2: data.video2,
                backgroundVideo: data.backgroundVideo,
                videoOneButtonText: data.videoOneButtonText,
                videoTwoButtonText: data.videoTwoButtonText,
            },
        });
        return { message: JSON.stringify(updatedPage) };
    } catch (error: any) {
        throw new Error(error);
    } finally {
        revalidatePath("/dashboard", "layout");
        revalidatePath("/", "layout");
    }
}
