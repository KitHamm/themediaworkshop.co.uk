"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Select, SelectItem } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";

const MediaSortBySelect = ({
	image,
	getSortBy,
	setSortBy,
}: Readonly<{
	image: boolean;
	getSortBy?: string;
	setSortBy?: Dispatch<SetStateAction<string>>;
}>) => {
	const { sortImagesBy, sortVideosBy, setSortImagesBy, setSortVideosBy } =
		useMediaState();

	const errorString =
		"Component needs to be in media provider or have props set.";

	const handleGetSortBy = () => {
		if (sortImagesBy != null && sortVideosBy != null) {
			return image ? sortImagesBy : sortVideosBy;
		}

		if (getSortBy) {
			return getSortBy;
		}
		throw new Error(errorString);
	};

	const handleSetSortBy = (value: string) => {
		if (setSortImagesBy != null && setSortVideosBy != null) {
			return image ? setSortImagesBy(value) : setSortVideosBy(value);
		}

		if (setSortBy) {
			return setSortBy(value);
		}
		throw new Error(errorString);
	};
	return (
		<Select
			className="dark ms-auto me-auto xl:me-0"
			classNames={{
				popoverContent: "bg-neutral-600",
			}}
			variant="bordered"
			selectedKeys={[handleGetSortBy()]}
			labelPlacement="outside"
			label={"Sort by"}
			onChange={(e) => handleSetSortBy(e.target.value)}
		>
			<SelectItem className="dark" key={"date"} value={"date"}>
				Date
			</SelectItem>
			<SelectItem className="dark" key={"name"} value={"name"}>
				Name
			</SelectItem>
		</Select>
	);
};

export default MediaSortBySelect;
