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
	const { getSortMediaBy, setSortMediaBy } = useMediaState();

	const handleGetSortBy = () => {
		if (getSortMediaBy) {
			return getSortMediaBy(image);
		} else if (getSortBy) {
			return getSortBy;
		}
		throw "Component needs to be in media provider or have getSortBy by props";
	};

	const handleSetSortBy = (value: string) => {
		if (setSortMediaBy) {
			return setSortMediaBy(value, image);
		} else if (setSortBy) {
			return setSortBy(value);
		}
		throw "Component needs to be in media provider or have setSortBy by props";
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
