"use server";

import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { revalidatePath } from "next/cache";

export async function deleteCaseStudy(id: number) {
	try {
		await prisma.caseStudy.delete({
			where: {
				id: id,
			},
		});
		revalidatePath("/dashboard");
		revalidatePath("/", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
