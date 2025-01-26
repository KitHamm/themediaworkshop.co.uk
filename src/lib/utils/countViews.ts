import { serviceRequest } from "@prisma/client";

export function countViews(
	entries: serviceRequest[]
): { page: string; views: number[] }[] {
	const predefinedPages = [
		"home",
		"film",
		"digital",
		"light",
		"events",
		"art",
	];

	const pageViews: { [page: string]: number[] } = {};

	const today = new Date();
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const day = new Date(today);
		day.setDate(today.getDate() - i);
		day.setHours(0, 0, 0, 0);
		return day;
	}).reverse();

	predefinedPages.forEach((page) => {
		pageViews[page] = Array(7).fill(0);
	});

	entries.forEach(({ page, createdAt }) => {
		if (!page || !pageViews[page]) return;

		const createdAtDay = new Date(createdAt);
		createdAtDay.setHours(0, 0, 0, 0);

		const dayIndex = last7Days.findIndex(
			(day) => createdAtDay.getTime() === day.getTime()
		);

		if (dayIndex === -1) return;

		pageViews[page][dayIndex] += 1;
	});

	const result = predefinedPages.map((page) => ({
		page: page.charAt(0).toUpperCase() + page.slice(1),
		views: pageViews[page],
	}));

	return result;
}
