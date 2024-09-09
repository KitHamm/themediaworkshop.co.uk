"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function DeleteSegment(id: number) {
    try {
        await prisma.segment.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2003") {
                return Promise.resolve({
                    status: 201,
                    message: "Segment has Case Studies",
                });
            }
        }
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/");
    }
}
