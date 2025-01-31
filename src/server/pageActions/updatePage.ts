"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { PageFormType } from "@/lib/types";

export async function updatePage(data: PageFormType) {
	try {
		const updatedPage = await prisma.page.update({
			where: {
				title: data.page,
			},
			data: {
				subTitle: data.subTitle,
				description: data.description,
				header: data.header,
				video1: data.video1,
				video2: data.video2,
				backgroundVideo: data.backgroundVideo,
				videoOneButtonText: data.videoOneButtonText,
				videoTwoButtonText: data.videoTwoButtonText,
			},
		});
		revalidatePath("/dashboard/pages", "layout");
		revalidatePath("/", "layout");
		return createResponse(true, updatedPage);
	} catch (error) {
		return createResponse(false, null, error);
	}
}
