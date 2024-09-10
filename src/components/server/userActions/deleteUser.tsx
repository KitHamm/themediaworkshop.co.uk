"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DeleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
