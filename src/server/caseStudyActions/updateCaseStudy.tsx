"use server";

import { CaseStudyFromType } from "@/lib/types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";

export async function updateCaseStudy(caseStudyData: CaseStudyFromType) {
	if (!caseStudyData.id) {
		return createResponse(false, null, "No id provided");
	}
	const imageUrls = caseStudyData.image.map((img) => img.url);
	const tagTexts = caseStudyData.tags.map((tag) => tag.text);

	try {
		await prisma.caseStudy.update({
			where: {
				id: caseStudyData.id,
			},
			data: {
				title: caseStudyData.title,
				dateLocation: caseStudyData.dateLocation,
				copy: caseStudyData.copy,
				image: imageUrls,
				video: caseStudyData.video,
				videoThumbnail: caseStudyData.videoThumbnail,
				tags: tagTexts,
				order: parseInt(caseStudyData.order.toString()),
				segmentId: caseStudyData.segmentId,
			},
		});
		revalidatePath("/dashboard");
		revalidatePath("/", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}

export async function updateCaseStudyPublished(id: number, published: boolean) {
	try {
		await prisma.caseStudy.update({
			where: {
				id: id,
			},
			data: {
				published: published,
			},
		});
		revalidatePath("/dashboard");
		revalidatePath("/", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
