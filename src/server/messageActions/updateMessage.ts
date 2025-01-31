"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";

export async function updateMessage(id: string, read: boolean) {
	try {
		await prisma.message.update({
			where: {
				id: id,
			},
			data: {
				read: read,
			},
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}

export async function updateMultipleMessages(ids: string[], read: boolean) {
	try {
		await prisma.message.updateMany({
			where: {
				id: { in: ids },
			},
			data: {
				read: read,
			},
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
