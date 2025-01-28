"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Select, SelectItem } from "@heroui/react";

const MediaOrderSelect = ({ image }: Readonly<{ image: boolean }>) => {
	const { setMediaOrderBy, getMediaOrderBy } = useMediaState();
	return (
		<Select
			className="dark ms-auto me-auto xl:me-0"
			classNames={{
				popoverContent: "bg-neutral-600",
			}}
			variant="bordered"
			selectedKeys={[getMediaOrderBy(image)]}
			labelPlacement="outside"
			label={"Order"}
			onChange={(e) => setMediaOrderBy(e.target.value, image)}
		>
			<SelectItem className="dark" key={"asc"} value={"asc"}>
				Ascending
			</SelectItem>
			<SelectItem className="dark" key={"desc"} value={"desc"}>
				Descending
			</SelectItem>
		</Select>
	);
};

export default MediaOrderSelect;
