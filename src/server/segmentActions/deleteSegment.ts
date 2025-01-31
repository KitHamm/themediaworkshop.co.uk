"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";

export async function deleteSegment(id: number) {
	try {
		await prisma.segment.delete({
			where: {
				id: id,
			},
		});
		revalidatePath("/dashboard");
		revalidatePath("/");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
