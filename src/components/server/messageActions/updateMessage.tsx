"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateMessage(id: string, read: boolean) {
    try {
        await prisma.message.update({
            where: {
                id: id,
            },
            data: {
                read: read,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function UpdateMultipleMessages(ids: string[], read: boolean) {
    try {
        await prisma.message.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                read: read,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
