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
		// Use Promise.all to fetch all data concurrently
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

		// Create a mapping of types to respective functions
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

		// Loop through the mappings and process them dynamically
		mappings.forEach(({ type, items, getData }) => {
			addErrorResponse(errorResponseArray, type, items, getData);
		});

		return errorResponseArray;
	} catch (error) {
		throw error;
	}
};

// import prisma from "@/lib/prisma";
// import { errorResponse } from "@/lib/types";
// import { CaseStudy, Page, Segment } from "@prisma/client";

// interface SegmentWithPage extends Segment {
// 	page: Page;
// }

// interface CaseStudyWithSegmentAndPage extends CaseStudy {
// 	segment: SegmentWithPage;
// }

// export const fetchReferences = async (
// 	fileName: string
// ): Promise<errorResponse[]> => {
// 	let errorResponseArray: errorResponse[] = [];

// 	try {
// 		const segmentHeader: SegmentWithPage[] = await prisma.segment.findMany({
// 			where: { headerimage: fileName },
// 			include: { page: true },
// 		});
// 		const segmentImages: SegmentWithPage[] = await prisma.segment.findMany({
// 			where: { image: { has: fileName } },
// 			include: { page: true },
// 		});
// 		const caseStudyImages: CaseStudyWithSegmentAndPage[] =
// 			await prisma.caseStudy.findMany({
// 				where: { image: { has: fileName } },
// 				include: {
// 					segment: {
// 						include: { page: true },
// 					},
// 				},
// 			});
// 		const caseStudyThumbnail: CaseStudyWithSegmentAndPage[] =
// 			await prisma.caseStudy.findMany({
// 				where: { videoThumbnail: fileName },
// 				include: {
// 					segment: {
// 						include: { page: true },
// 					},
// 				},
// 			});
// 		const pageBackground: Page[] = await prisma.page.findMany({
// 			where: { backgroundVideo: fileName },
// 		});
// 		const pageShowreel: Page[] = await prisma.page.findMany({
// 			where: { video1: fileName },
// 		});
// 		const pageYear: Page[] = await prisma.page.findMany({
// 			where: { video2: fileName },
// 		});
// 		const segmentVideos: SegmentWithPage[] = await prisma.segment.findMany({
// 			where: { video: { has: fileName } },
// 			include: { page: true },
// 		});
// 		const caseStudyVideo: CaseStudyWithSegmentAndPage[] =
// 			await prisma.caseStudy.findMany({
// 				where: { video: fileName },
// 				include: {
// 					segment: {
// 						include: { page: true },
// 					},
// 				},
// 			});

// 		segmentHeader.forEach((segment: SegmentWithPage) => {
// 			errorResponseArray.push({
// 				type: "Segment Header",
// 				segmentTitle: segment.title || "Unnamed",
// 				pageTitle: segment.page!.title,
// 			});
// 		});

// 		segmentImages.forEach((segment: SegmentWithPage) => {
// 			errorResponseArray.push({
// 				type: "Segment Image",
// 				segmentTitle: segment.title || "Unnamed",
// 				pageTitle: segment.page!.title,
// 			});
// 		});

// 		caseStudyImages.forEach((caseStudy: CaseStudyWithSegmentAndPage) => {
// 			errorResponseArray.push({
// 				type: "Case Study Image",
// 				caseTitle: caseStudy.title || "Unnamed",
// 				segmentTitle: caseStudy.segment.title || "Unnamed",
// 				pageTitle: caseStudy.segment.page!.title,
// 			});
// 		});

// 		caseStudyThumbnail.forEach((caseStudy: CaseStudyWithSegmentAndPage) => {
// 			errorResponseArray.push({
// 				type: "Case Study Thumbnail",
// 				caseTitle: caseStudy.title || "Unnamed",
// 				segmentTitle: caseStudy.segment.title || "Unnamed",
// 				pageTitle: caseStudy.segment.page!.title,
// 			});
// 		});

// 		pageBackground.forEach((page: Page) => {
// 			errorResponseArray.push({
// 				type: "Page Background Video",
// 				pageTitle: page.title,
// 			});
// 		});

// 		pageShowreel.forEach((page: Page) => {
// 			errorResponseArray.push({
// 				type: "Page Video",
// 				pageTitle: page.title,
// 			});
// 		});

// 		pageYear.forEach((page: Page) => {
// 			errorResponseArray.push({
// 				type: "Page Video",
// 				pageTitle: page.title,
// 			});
// 		});

// 		segmentVideos.forEach((segment: SegmentWithPage) => {
// 			errorResponseArray.push({
// 				type: "Segment Video",
// 				segmentTitle: segment.title || "Unnamed",
// 				pageTitle: segment.page!.title,
// 			});
// 		});

// 		caseStudyVideo.forEach((caseStudy: CaseStudyWithSegmentAndPage) => {
// 			errorResponseArray.push({
// 				type: "Case Study Video",
// 				caseTitle: caseStudy.title || "Unnamed",
// 				segmentTitle: caseStudy.segment.title || "Unnamed",
// 				pageTitle: caseStudy.segment.page!.title,
// 			});
// 		});

// 		return errorResponseArray;
// 	} catch (error) {
// 		throw error;
// 	}
// };
