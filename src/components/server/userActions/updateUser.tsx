"use server";

import { UserFormTypes } from "@/components/dashboard/Settings";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateUser(data: UserFormTypes, id: string) {
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
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
