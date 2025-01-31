"use server";

import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { revalidatePath } from "next/cache";

export async function checkUserActivation(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: id },
		});
		if (!user) {
			return { success: false, activated: false };
		}
		revalidatePath("/dashboard");
		return { success: false, activated: user.activated };
	} catch (error) {
		return { success: false, activated: false };
	}
}

export async function updateUserActivation(id: string) {
	try {
		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				activated: true,
			},
		});
		revalidatePath("/dashboard");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
