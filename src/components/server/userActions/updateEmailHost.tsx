"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateEmailHost(oldEmail: string, newEmail: string) {
    try {
        await prisma.emailHost.update({
            where: {
                emailHost: oldEmail,
            },
            data: {
                emailHost: newEmail,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
