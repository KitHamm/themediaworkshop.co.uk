export const createResponse = <T>(
	success: boolean,
	payload: T | null = null,
	error: unknown = null
) => {
	if (success) {
		return { success, data: payload } as const;
	}

	let errorMessage = "An unknown error occurred";

	if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === "string") {
		errorMessage = error;
	}

	return { success, error: errorMessage } as const;
};
