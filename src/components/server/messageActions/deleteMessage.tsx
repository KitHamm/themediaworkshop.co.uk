"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteMessage(id: string) {
    try {
        await prisma.message.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function DeleteMultipleMessages(ids: string[]) {
    try {
        await prisma.message.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
