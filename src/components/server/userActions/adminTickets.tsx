"use server";

import { TicketFormType } from "@/components/dashboard/modals/CreateTicketModal";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function CreateTicket(data: TicketFormType) {
    try {
        await prisma.tickets.create({
            data: {
                from: data.submittedBy,
                dashboard: data.dashboard,
                reproducible: data.reproducible,
                description: data.problem,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function ResolveTicket(id: string, resolved: boolean) {
    try {
        await prisma.tickets.update({
            where: {
                id: id,
            },
            data: {
                resolved: resolved,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}

export async function DeleteTicket(id: string) {
    try {
        await prisma.tickets.delete({
            where: {
                id: id,
            },
        });
        return Promise.resolve({ status: 200, message: "success" });
    } catch (err: any) {
        return Promise.resolve({ status: 201, message: err });
    } finally {
        revalidatePath("/dashboard");
    }
}
