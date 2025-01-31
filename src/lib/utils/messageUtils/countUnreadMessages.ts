import { Message } from "@prisma/client";

export default function countUnreadMessages(messages: Message[]) {
	let unreadMessages = 0;
	messages.forEach((message: Message) => {
		if (message.read === false) {
			unreadMessages += 1;
		}
	});
	return unreadMessages;
}
