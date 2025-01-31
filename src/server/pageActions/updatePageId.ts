"use server";

import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { revalidatePath } from "next/cache";
export default async function updatePageOrder(
	currentId: number,
	newId: number
) {
	const tempId = -1;
	try {
		// move current page to temp position
		await prisma.page.update({
			where: {
				id: currentId,
			},
			data: {
				id: tempId,
			},
		});
		// 5 -> 1
		if (currentId > newId) {
			await prisma.page.updateMany({
				where: {
					id: {
						gte: newId,
						lt: currentId,
					},
				},
				data: {
					id: {
						increment: 1,
					},
				},
			});
			await prisma.page.update({
				where: {
					id: tempId,
				},
				data: {
					id: newId,
				},
			});
		} else {
			await prisma.page.updateMany({
				where: {
					id: {
						gt: currentId,
						lte: newId,
					},
				},
				data: {
					id: {
						decrement: 1,
					},
				},
			});
			await prisma.page.update({
				where: {
					id: tempId,
				},
				data: {
					id: newId,
				},
			});
		}
		revalidatePath("/dashboard", "layout");
		revalidatePath("/", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
