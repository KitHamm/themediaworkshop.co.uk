import axios from "axios";
import { revalidateDashboard } from "@/server/revalidateDashboard";

export function deleteFile(file: string): Promise<void> {
	return new Promise((resolve, reject) => {
		axios
			.post(
				"/api/delete",
				{ fileName: file },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then(() => {
				revalidateDashboard();
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
	});
}
