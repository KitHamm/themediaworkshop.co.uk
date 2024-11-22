"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteSegment(id: number) {
    try {
        await prisma.segment.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                return Promise.reject(new Error("Segment has Messages"));
            }
        } else {
            return Promise.reject(new Error(error));
        }
        return Promise.resolve();
    } finally {
        revalidatePath("/dashboard");
        revalidatePath("/");
    }
}
