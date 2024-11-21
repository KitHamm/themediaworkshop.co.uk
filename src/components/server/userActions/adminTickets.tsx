"use server";

import { TicketFormType } from "@/lib/types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTicket(data: TicketFormType) {
    try {
        await prisma.tickets.create({
            data: {
                from: data.submittedBy,
                dashboard: data.dashboard,
                reproducible: data.reproducible,
                description: data.problem,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function resolveTicket(id: string, resolved: boolean) {
    try {
        await prisma.tickets.update({
            where: {
                id: id,
            },
            data: {
                resolved: resolved,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}

export async function deleteTicket(id: string) {
    try {
        await prisma.tickets.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve();
    } catch (error: any) {
        return Promise.reject(new Error(error));
    } finally {
        revalidatePath("/dashboard", "layout");
    }
}
