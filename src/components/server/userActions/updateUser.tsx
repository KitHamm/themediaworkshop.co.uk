"use server";

import { UserFormTypes } from "@/components/dashboard/Settings";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUser(data: UserFormTypes, id: string) {
    try {
        await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                firstname: data.firstName,
                lastname: data.lastName,
                email: data.email,
                role: data.role,
                position: data.position,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard");
    }
}
