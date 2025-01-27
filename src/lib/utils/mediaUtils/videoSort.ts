import { Videos } from "@prisma/client";

export function videoSort(videos: Videos[], type: "HEADER" | "VIDEO") {
	return videos.filter(function (video: Videos) {
		return video.name.split("_")[0] === type;
	});
}
