import { randomBytes } from "crypto";

export default function randomPassword(length: number) {
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	const randomValues = randomBytes(length);

	return Array.from(randomValues)
		.map((value) => characters.charAt(value % characters.length))
		.join("");
}
