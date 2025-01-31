"use server";

import { CaseStudyFromType } from "@/lib/types";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";

export async function createCaseStudy(caseStudyData: CaseStudyFromType) {
	const imageUrls = caseStudyData.image.map((img) => img.url);
	const tagTexts = caseStudyData.tags.map((tag) => tag.text);

	try {
		await prisma.caseStudy.create({
			data: {
				title: caseStudyData.title,
				copy: caseStudyData.copy,
				dateLocation: caseStudyData.dateLocation,
				image: imageUrls,
				video: caseStudyData.video,
				videoThumbnail: caseStudyData.videoThumbnail,
				tags: tagTexts,
				order: parseInt(caseStudyData.order.toString()),
				published: caseStudyData.published,
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
