"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Select, SelectItem } from "@heroui/react";

const MediaPerPageSelect = ({ image }: Readonly<{ image: boolean }>) => {
	const { getMediaPerPage, setMediaPerPage } = useMediaState();
	const label = image ? "Images" : "Videos";

	return (
		<Select
			className="dark ms-auto me-auto xl:me-0"
			classNames={{
				popoverContent: "bg-neutral-600",
			}}
			variant="bordered"
			selectedKeys={[getMediaPerPage(image).toString()]}
			labelPlacement="outside"
			label={`${label} Per Page`}
			onChange={(e) => setMediaPerPage(parseInt(e.target.value), image)}
		>
			<SelectItem className="dark" key={8} value={8}>
				8
			</SelectItem>
			<SelectItem className="dark" key={12} value={12}>
				12
			</SelectItem>
			<SelectItem className="dark" key={16} value={16}>
				16
			</SelectItem>
			<SelectItem className="dark" key={20} value={20}>
				20
			</SelectItem>
			<SelectItem className="dark" key={1000000} value={1000000}>
				All
			</SelectItem>
		</Select>
	);
};

export default MediaPerPageSelect;
