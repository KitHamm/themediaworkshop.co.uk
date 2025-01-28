import axios from "axios";
import { revalidateDashboard } from "@/server/revalidateDashboard";

export async function uploadMedia(
	file?: File
): Promise<{ success: boolean; message: string }> {
	if (!file) {
		return { success: false, message: "No file provided" };
	}

	const type = file.type.split("/")[0] === "image" ? "image" : "video";
	const formData = new FormData();
	formData.append("file", file);

	try {
		console.log("uploading");
		const res = await axios.post(`/api/${type}`, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});

		if (res.status === 201) {
			revalidateDashboard();
			return {
				success: true,
				message: res.data.message || "File uploaded successfully",
			};
		} else {
			return {
				success: false,
				message: `Unexpected status code: ${res.status}`,
			};
		}
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: "Error uploading file. Please try again later.",
		};
	}
}
