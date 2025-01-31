"use server";
import prisma from "@/lib/prisma";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import { hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import createUserTemplate from "@/components/email/createUserEmail";
import sendEmail from "../email/sendEmail";
import { UserFormTypes } from "@/lib/types";

export async function createUser(data: UserFormTypes) {
	try {
		const settings = await prisma.emailHost.findFirst();
		const hashedPassword = await hash(data.password, 12);
		await prisma.user.create({
			data: {
				email: data.email,
				firstname: data.firstName,
				lastname: data.lastName,
				image: data.image,
				position: data.position,
				password: hashedPassword,
			},
		});

		if (settings) {
			const html = createUserTemplate(data.password);
			await sendEmail(
				settings.emailHost,
				data.email,
				`${data.firstName} ${data.lastName}`,
				"New Account",
				"An account has been created for you.",
				html
			);
		}

		revalidatePath("/dashboard", "layout");
		return createResponse(true, data.password);
	} catch (error) {
		return createResponse(false, null, error);
	}
}
