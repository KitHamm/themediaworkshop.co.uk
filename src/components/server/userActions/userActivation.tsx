"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function CheckUserActivation(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            return Promise.resolve({ status: 201, message: false });
        }
        return Promise.resolve({ status: 200, message: user.activated });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function UpdateUserActivation(id: string) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                activated: true,
            },
        });
        return Promise.resolve({ status: 200, message: "updated" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
