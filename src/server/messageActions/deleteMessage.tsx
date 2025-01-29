"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";

export async function deleteMessage(id: string) {
	try {
		await prisma.message.delete({
			where: {
				id: id,
			},
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error: any) {
		return createResponse(false, null, error);
	}
}

export async function deleteMultipleMessages(ids: string[]) {
	try {
		await prisma.message.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
