import { Images, Logos } from "@prisma/client";

export function imageSort(
	images: Images[],
	logos: Logos[],
	type: "SEGHEAD" | "SEGMENT" | "STUDY" | "LOGO" | "THUMBNAIL"
) {
	return images.concat(logos).filter(function (image: Images | Logos) {
		return image.name.split("_")[0] === type;
	});
}
