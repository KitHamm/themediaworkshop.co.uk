"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { TicketFormType } from "@/lib/types";

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
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
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
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}

export async function deleteTicket(id: string) {
	try {
		await prisma.tickets.delete({
			where: {
				id: id,
			},
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
