"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkUserActivation(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return Promise.resolve({ status: 201, message: false });
        }
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function updateUserActivation(id: string) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                activated: true,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
    }
}
