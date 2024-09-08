"use server";

import { authOptions } from "@/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ServiceRequest(page: string) {
    const session = await getServerSession(authOptions);
    if (!session) {
        await prisma.serviceRequest.create({
            data: {
                page: page,
            },
        });
    }
}
