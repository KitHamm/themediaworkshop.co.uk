"use server";

import { UserPasswordFormTypes } from "@/lib/types";
import prisma from "@/lib/prisma";
import { hash, compare } from "bcrypt";
import { revalidatePath } from "next/cache";

export async function changePassword(data: UserPasswordFormTypes) {
    const changeHashedPassword = await hash(data.password, 12);
    const changeUser = await prisma.user.findUnique({
        where: {
            id: data.id,
        },
    });

    const changeIsPasswordValid = await compare(
        data.currentPassword,
        changeUser!.password!
    );

    if (!changeIsPasswordValid) {
        return Promise.resolve({
            status: 201,
            message: "Current Password does not match.",
        });
    }
    try {
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: { password: changeHashedPassword },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
