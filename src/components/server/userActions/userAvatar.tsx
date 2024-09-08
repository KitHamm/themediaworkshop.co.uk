"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GetAvatar(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        if (user) {
            return Promise.resolve({ status: 200, avatar: user.image });
        } else {
            return Promise.resolve({ status: 201, avatar: undefined });
        }
    } catch (err: any) {
        return Promise.resolve({ status: 201, avatar: err });
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function UpdateAvatar(id: string, imageUrl: string) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                image: imageUrl,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
