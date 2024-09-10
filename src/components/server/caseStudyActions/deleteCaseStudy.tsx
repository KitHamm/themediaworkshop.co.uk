"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteCaseStudy(id: number) {
    try {
        await prisma.caseStudy.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/");
    }
}
