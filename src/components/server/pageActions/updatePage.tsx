"use server";

import { PageFormType } from "@/components/dashboard/Pages/PageEdit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdatePage(data: PageFormType) {
    try {
        const page = await prisma.page.update({
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
        return Promise.resolve({ status: 200, message: JSON.stringify(page) });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
