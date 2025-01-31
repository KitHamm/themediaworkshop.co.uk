"use server";

import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

export default async function sendEmail(
	emailHost: string,
	recipientEmail: string,
	recipientName: string,
	subject: string,
	fallBackText: string,
	payload: string
) {
	const key = process.env.MAILERSEND_API;
	if (!key) return;
	try {
		const mailerSend = new MailerSend({
			apiKey: key,
		});

		const sentFrom = new Sender(emailHost, "The Media Workshop Ltd");
		const sendTo = [new Recipient(recipientEmail, recipientName)];

		const emailParams = new EmailParams()
			.setFrom(sentFrom)
			.setTo(sendTo)
			.setReplyTo(sentFrom)
			.setSubject(subject)
			.setHtml(payload)
			.setText(fallBackText);

		await mailerSend.email.send(emailParams);
	} catch (error) {
		console.log(error);
	}
}
