"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
