"use server";

import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { revalidatePath } from "next/cache";

export async function updateEmailHost(
	oldEmail: string | undefined,
	newEmail: string
) {
	try {
		await prisma.emailHost.upsert({
			where: {
				emailHost: oldEmail,
			},
			update: {
				emailHost: newEmail,
			},
			create: {
				emailHost: newEmail,
			},
		});
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
