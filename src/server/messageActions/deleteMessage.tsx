"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id: string) {
    try {
        await prisma.message.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function deleteMultipleMessages(ids: string[]) {
    try {
        await prisma.message.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
