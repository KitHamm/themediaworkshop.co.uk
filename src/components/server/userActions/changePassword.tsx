"use server";

import { UserPasswordFormTypes } from "@/components/dashboard/Settings";
import prisma from "@/lib/prisma";
import { hash, compare } from "bcrypt";
import { revalidatePath } from "next/cache";

export async function ChangePassword(data: UserPasswordFormTypes) {
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
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
