"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { UserFormTypes } from "@/lib/types";

export async function updateUser(data: UserFormTypes, id: string) {
	try {
		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				firstname: data.firstName,
				lastname: data.lastName,
				email: data.email,
				role: data.role,
				position: data.position,
			},
		});
		revalidatePath("/dashboard");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
