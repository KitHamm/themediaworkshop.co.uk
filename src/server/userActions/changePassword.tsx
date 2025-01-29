"use server";

import { UserPasswordFormTypes } from "@/lib/types";
import prisma from "@/lib/prisma";
import { hash, compare } from "bcrypt";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";

export async function changePassword(data: UserPasswordFormTypes) {
	try {
		const changeHashedPassword = await hash(data.password, 12);
		const changeUser = await prisma.user.findUnique({
			where: {
				id: data.id,
			},
		});

		if (!changeUser || !changeUser.password) {
			return createResponse(false, null, "User not found.");
		}

		const changeIsPasswordValid = await compare(
			data.currentPassword,
			changeUser.password
		);

		if (!changeIsPasswordValid) {
			return createResponse(
				false,
				null,
				"Current Password does not match."
			);
		}

		await prisma.user.update({
			where: {
				id: data.id,
			},
			data: { password: changeHashedPassword },
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
