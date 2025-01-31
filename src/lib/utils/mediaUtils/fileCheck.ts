import { FilePrefixList, MediaType } from "@/lib/constants";

export function fileCheck(
	file: File,
	mediaType?: MediaType
): { success: boolean; message: string } {
	if (!file) return { success: false, message: "no file" };
	const fileType = file.type.split("/")[0];
	const fileSize = file.size / 1024 / 1024; // size in MB
	const filePrefix = file.name.split("_")[0];
	const sizeCheck = fileSize < 100;

	const isValidType = (mediaType: MediaType | undefined): boolean => {
		if (mediaType) {
			return mediaType === MediaType.VIDEO ||
				mediaType === MediaType.HEADER
				? fileType === "video"
				: fileType === "image";
		}
		return true;
	};

	const isValidName = (mediaType: MediaType | undefined): boolean => {
		if (mediaType === MediaType.AVATAR) return true;
		return mediaType
			? filePrefix === mediaType
			: FilePrefixList.includes(filePrefix);
	};

	if (!isValidType(mediaType)) {
		const message =
			mediaType === MediaType.VIDEO || mediaType === MediaType.HEADER
				? "Please upload in video format."
				: "Please upload in image format.";
		return { success: false, message };
	}

	if (!isValidName(mediaType)) {
		const message = mediaType
			? `File name should be prefixed with ${mediaType}_`
			: "Please check the file name prefix.";
		return { success: false, message };
	}

	if (!sizeCheck) return { success: false, message: "File size too large." };

	return { success: true, message: "success" };
}
