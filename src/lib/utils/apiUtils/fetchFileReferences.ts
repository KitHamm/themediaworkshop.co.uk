import prisma from "@/lib/prisma";
import { errorResponse } from "@/lib/types";
import { CaseStudy, Page, Segment } from "@prisma/client";

// Interfaces
interface SegmentWithPage extends Segment {
	page: Page;
}

interface CaseStudyWithSegmentAndPage extends CaseStudy {
	segment: SegmentWithPage;
}

// Utility function to add error responses
const addErrorResponse = (
	errorResponseArray: errorResponse[],
	type: string,
	items: any[],
	getData: (item: any) => errorResponse
) => {
	items.forEach((item) => {
		errorResponseArray.push(getData(item));
	});
};

// Fetch references function
export const fetchReferences = async (
	fileName: string
): Promise<errorResponse[]> => {
	const errorResponseArray: errorResponse[] = [];

	try {
		const [
			segmentHeader,
			segmentImages,
			caseStudyImages,
			caseStudyThumbnail,
			pageBackground,
			pageShowreel,
			pageYear,
			segmentVideos,
			caseStudyVideo,
		] = await Promise.all([
			prisma.segment.findMany({
				where: { headerimage: fileName },
				include: { page: true },
			}),
			prisma.segment.findMany({
				where: { image: { has: fileName } },
				include: { page: true },
			}),
			prisma.caseStudy.findMany({
				where: { image: { has: fileName } },
				include: {
					segment: {
						include: { page: true },
					},
				},
			}),
			prisma.caseStudy.findMany({
				where: { videoThumbnail: fileName },
				include: {
					segment: {
						include: { page: true },
					},
				},
			}),
			prisma.page.findMany({
				where: { backgroundVideo: fileName },
			}),
			prisma.page.findMany({
				where: { video1: fileName },
			}),
			prisma.page.findMany({
				where: { video2: fileName },
			}),
			prisma.segment.findMany({
				where: { video: { has: fileName } },
				include: { page: true },
			}),
			prisma.caseStudy.findMany({
				where: { video: fileName },
				include: {
					segment: {
						include: { page: true },
					},
				},
			}),
		]);

		const mappings = [
			{
				type: "Segment Header",
				items: segmentHeader,
				getData: (item: SegmentWithPage): errorResponse => ({
					type: "Segment Header",
					segmentTitle: item.title || "Unnamed",
					pageTitle: item.page.title,
				}),
			},
			{
				type: "Segment Image",
				items: segmentImages,
				getData: (item: SegmentWithPage): errorResponse => ({
					type: "Segment Image",
					segmentTitle: item.title || "Unnamed",
					pageTitle: item.page.title,
				}),
			},
			{
				type: "Case Study Image",
				items: caseStudyImages,
				getData: (
					item: CaseStudyWithSegmentAndPage
				): errorResponse => ({
					type: "Case Study Image",
					caseTitle: item.title || "Unnamed",
					segmentTitle: item.segment.title || "Unnamed",
					pageTitle: item.segment.page.title,
				}),
			},
			{
				type: "Case Study Thumbnail",
				items: caseStudyThumbnail,
				getData: (
					item: CaseStudyWithSegmentAndPage
				): errorResponse => ({
					type: "Case Study Thumbnail",
					caseTitle: item.title || "Unnamed",
					segmentTitle: item.segment.title || "Unnamed",
					pageTitle: item.segment.page.title,
				}),
			},
			{
				type: "Page Background Video",
				items: pageBackground,
				getData: (item: Page): errorResponse => ({
					type: "Page Background Video",
					pageTitle: item.title,
				}),
			},
			{
				type: "Page Video",
				items: pageShowreel,
				getData: (item: Page): errorResponse => ({
					type: "Page Video",
					pageTitle: item.title,
				}),
			},
			{
				type: "Page Video",
				items: pageYear,
				getData: (item: Page): errorResponse => ({
					type: "Page Video",
					pageTitle: item.title,
				}),
			},
			{
				type: "Segment Video",
				items: segmentVideos,
				getData: (item: SegmentWithPage): errorResponse => ({
					type: "Segment Video",
					segmentTitle: item.title || "Unnamed",
					pageTitle: item.page.title,
				}),
			},
			{
				type: "Case Study Video",
				items: caseStudyVideo,
				getData: (
					item: CaseStudyWithSegmentAndPage
				): errorResponse => ({
					type: "Case Study Video",
					caseTitle: item.title || "Unnamed",
					segmentTitle: item.segment.title || "Unnamed",
					pageTitle: item.segment.page.title,
				}),
			},
		];

		mappings.forEach(({ type, items, getData }) => {
			addErrorResponse(errorResponseArray, type, items, getData);
		});

		return errorResponseArray;
	} catch (error) {
		console.error("An error occurred:", error);
		throw error;
	}
};
