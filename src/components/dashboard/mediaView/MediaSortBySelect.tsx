"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Select, SelectItem } from "@heroui/react";

const MediaSortBySelect = ({ image }: Readonly<{ image: boolean }>) => {
	const { getSortMediaBy, setSortMediaBy } = useMediaState();
	return (
		<Select
			className="dark ms-auto me-auto xl:me-0"
			classNames={{
				popoverContent: "bg-neutral-600",
			}}
			variant="bordered"
			selectedKeys={[getSortMediaBy(image)]}
			labelPlacement="outside"
			label={"Sort by"}
			onChange={(e) => setSortMediaBy(e.target.value, image)}
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
