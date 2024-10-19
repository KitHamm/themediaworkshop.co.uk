"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCaseStudy(id: number) {
    try {
        await prisma.caseStudy.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/", "layout");
    }
}
