import { errorResponse } from "@/lib/types";

export type DeleteError = {
	response: {
		data: {
			errorArray: errorResponse[];
		};
	};
};
