"use server";

import prisma from "@/lib/prisma";
import { compare, hash } from "bcrypt";
import { revalidatePath } from "next/cache";
import { createResponse } from "@/lib/utils/serverUtils/createResponse";
import resetUserTemplate from "@/components/email/resetUserEmail";
import sendEmail from "../email/sendEmail";
import { ResetUserPasswordFormType } from "@/lib/types";

export async function resetUserPassword(data: ResetUserPasswordFormType) {
	try {
		const settings = await prisma.emailHost.findFirst();
		const hashedPassword = await hash(data.password, 12);
		const admin = await prisma.user.findUnique({
			where: {
				id: data.adminId,
			},
		});

		if (!admin?.password) {
			return createResponse(false, null, "Admin not found.");
		}

		const isPasswordValid = await compare(
			data.adminPassword,
			admin.password
		);

		if (!isPasswordValid) {
			return createResponse(
				false,
				null,
				"Admin Password does not match."
			);
		}

		const updated = await prisma.user.update({
			where: {
				id: data.userId,
			},
			data: { password: hashedPassword },
		});

		if (settings) {
			const html = resetUserTemplate(data.password);
			await sendEmail(
				settings.emailHost,
				updated.email,
				`${updated.firstname} ${updated.lastname}`,
				"Password Reset",
				"Your password has been reset.",
				html
			);
		}

		revalidatePath("/dashboard");

		return createResponse(true, data.password);
	} catch (error) {
		return createResponse(false, null, error);
	}
}
