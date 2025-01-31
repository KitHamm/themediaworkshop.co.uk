"use server";
import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import newMessageEmailTemplate from "@/components/email/newMessageEmailTemplate";
import sendEmail from "../email/sendEmail";
import { revalidatePath } from "next/cache";
import { ContactFormTypes } from "@/lib/types";

export async function createMessage(data: ContactFormTypes) {
	try {
		const settings = await prisma.emailHost.findFirst();
		await prisma.message.create({
			data: {
				name: data.name,
				email: data.email,
				message: data.message,
			},
		});

		if (settings) {
			const html = newMessageEmailTemplate(data.name);
			await sendEmail(
				settings.emailHost,
				settings.emailHost,
				"Admin",
				"New Message!",
				"You have received a new message on the website.",
				html
			);
		}
		revalidatePath("/dashboard", "layout");
		return createResponse(true, "success");
	} catch (error) {
		return createResponse(false, null, error);
	}
}
