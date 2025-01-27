import { Images, Logos, Message, Videos } from "@prisma/client";
import { FilePrefixList, MediaType } from "./constants";

export function DateRender(date: Date) {
	var formattedDate;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	formattedDate = day + "/" + month + "/" + year;
	return formattedDate;
}

export function imageSort(
	images: Images[],
	logos: Logos[],
	type: "SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL"
) {
	return images.concat(logos).filter(function (image: Images | Logos) {
		return image.name.split("_")[0] === type;
	});
}

export function videoSort(videos: Videos[], type: "HEADER" | "VIDEO") {
	return videos.filter(function (video: Videos) {
		return video.name.split("_")[0] === type;
	});
}
type Items = {
	name: string;
	createdAt: Date;
};
export function itemOrder(items: Items[], sortBy: string, orderBy: string) {
	const temp: Items[] = [...items];
	switch (sortBy) {
		case "date":
			if (orderBy === "desc") {
				temp.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
				);
				return temp;
			} else {
				temp.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
				);
				return temp;
			}
		case "name":
			if (orderBy === "desc") {
				temp.sort((a, b) => b.name.localeCompare(a.name));
				return temp;
			} else {
				temp.sort((a, b) => a.name.localeCompare(b.name));
				return temp;
			}
		default:
			return temp;
	}
}

export function handleChevronOnScroll(chevron: HTMLDivElement) {
	if (chevron) {
		chevron.classList.replace("opacity-100", "opacity-0");
	}
}

export function parallaxOnScroll(
	headerImageContainerEl: HTMLDivElement,
	headerImageEl: HTMLImageElement,
	setParallaxValue: React.Dispatch<React.SetStateAction<number>>,
	setContainerHeight: React.Dispatch<React.SetStateAction<number>>
) {
	if (headerImageContainerEl && headerImageEl) {
		const containerHeight = headerImageContainerEl.offsetHeight;
		const imageHeight = headerImageEl.offsetHeight;
		setContainerHeight((imageHeight / 8) * 6);
		if (
			headerImageContainerEl.getBoundingClientRect().top <
				window.innerHeight &&
			headerImageContainerEl.getBoundingClientRect().top >
				0 - containerHeight
		) {
			setParallaxValue(
				0 -
					mapNumRange(
						headerImageContainerEl.getBoundingClientRect().top,
						window.innerHeight,
						0,
						imageHeight - containerHeight,
						0
					)
			);
		}
	}
}

export function randomPassword(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
		counter += 1;
	}
	return result;
}

export const mapNumRange = (
	num: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
) => ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

export function countUnreadMessages(messages: Message[]) {
	let unreadMessages = 0;
	messages.forEach((message: Message) => {
		if (message.read === false) {
			unreadMessages += 1;
		}
	});
	return unreadMessages;
}

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
