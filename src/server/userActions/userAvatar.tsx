"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAvatar(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        if (user) {
            return Promise.resolve({ avatar: user.image });
        } else {
            return Promise.resolve({ avatar: undefined });
        }
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function updateAvatar(id: string, imageUrl: string) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                image: imageUrl,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
    }
}
