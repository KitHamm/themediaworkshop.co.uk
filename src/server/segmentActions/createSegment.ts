"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { SegmentFormType } from "@/lib/types";

export async function createSegment(
	segmentData: SegmentFormType,
	pageId: number
) {
	const imageUrls = segmentData.image.map((img) => img.url);
	const videoUrls = segmentData.video.map((video) => video.url);

	try {
		await prisma.segment.create({
			data: {
				title: segmentData.title,
				copy: segmentData.copy,
				image: imageUrls,
				video: videoUrls,
				headerimage: segmentData.headerImage,
				order: parseInt(segmentData.order.toString()),
				buttonText: segmentData.buttonText,
				linkTo: segmentData.linkTo,
				pageId: pageId,
			},
		});
		revalidatePath("/dashboard");
		revalidatePath("/", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
