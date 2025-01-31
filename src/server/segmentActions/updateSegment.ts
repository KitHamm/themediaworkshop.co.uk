"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { SegmentFormType } from "@/lib/types";

export async function updateSegment(data: SegmentFormType) {
	const imageUrls = data.image.map((img) => img.url);
	const videoUrls = data.video.map((video) => video.url);

	try {
		const updatedSegment = await prisma.segment.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				copy: data.copy,
				image: imageUrls,
				video: videoUrls,
				headerimage: data.headerImage,
				order: parseInt(data.order.toString()),
				buttonText: data.buttonText,
				linkTo: data.linkTo,
			},
		});
		revalidatePath("/", "layout");
		revalidatePath("/dashboard", "layout");
		return createResponse(true, updatedSegment);
	} catch (error) {
		return createResponse(false, null, error);
	}
}

export async function updateSegmentPublish(id: number, published: boolean) {
	try {
		await prisma.segment.update({
			where: {
				id: id,
			},
			data: {
				published: published,
			},
		});
		revalidatePath("/", "layout");
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
