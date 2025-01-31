"use server";

import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { revalidatePath } from "next/cache";

export async function getAvatar(id: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: id },
		});
		if (user) {
			return Promise.resolve({ avatar: user.image });
		} else {
			return Promise.resolve({ avatar: undefined });
		}
	} catch (error: any) {
		return Promise.reject(new Error(error));
	} finally {
		revalidatePath("/dashboard");
	}
}

export async function updateAvatar(id: string, imageUrl: string) {
	try {
		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				image: imageUrl,
			},
		});
		revalidatePath("/dashboard");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
