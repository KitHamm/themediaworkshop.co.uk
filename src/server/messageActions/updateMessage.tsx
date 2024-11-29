"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMessage(id: string, read: boolean) {
    try {
        await prisma.message.update({
            where: {
                id: id,
            },
            data: {
                read: read,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function updateMultipleMessages(ids: string[], read: boolean) {
    try {
        await prisma.message.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                read: read,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
