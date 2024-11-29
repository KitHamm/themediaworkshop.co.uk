"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateEmailHost(oldEmail: string, newEmail: string) {
    try {
        await prisma.emailHost.update({
            where: {
                emailHost: oldEmail,
            },
            data: {
                emailHost: newEmail,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
