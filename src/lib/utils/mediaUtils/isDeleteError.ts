import { DeleteError } from "@/lib/types/serverTypes/apiTypes";

export function isDeleteError(error: unknown): error is DeleteError {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		"data" in (error as any).response &&
		"errorArray" in (error as any).response.data
	);
}
