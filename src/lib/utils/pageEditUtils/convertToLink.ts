import { toLink } from "@prisma/client";

export default function convertToLink(text: string) {
	const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
	const upperCase = text.toUpperCase();
	const link = toLink[upperCase as keyof typeof toLink];
	return { capitalized, upperCase, link };
}
