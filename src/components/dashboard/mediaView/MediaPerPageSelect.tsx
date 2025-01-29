"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Select, SelectItem } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";

const MediaPerPageSelect = ({
	image,
	perPage,
	setPerPage,
}: Readonly<{
	image: boolean;
	perPage?: number;
	setPerPage?: Dispatch<SetStateAction<number>>;
}>) => {
	const { getMediaPerPage, setMediaPerPage } = useMediaState();
	const label = image ? "Images" : "Videos";

	const handleGetMediaPerPage = () => {
		if (getMediaPerPage) {
			return getMediaPerPage(image).toString();
		} else if (perPage) {
			return perPage.toString();
		}
		throw "Component needs to be in media context or set perPage props";
	};

	const handleSetPerPage = (value: number, isImage: boolean) => {
		if (setMediaPerPage) {
			setMediaPerPage(value, isImage);
			return;
		} else if (setPerPage) {
			setPerPage(value);
			return;
		}
		throw "Component needs to be in media context or set setPerPage props";
	};

	return (
		<Select
			className="dark ms-auto me-auto xl:me-0"
			classNames={{
				popoverContent: "bg-neutral-600",
			}}
			variant="bordered"
			selectedKeys={[handleGetMediaPerPage()]}
			labelPlacement="outside"
			label={`${label} Per Page`}
			onChange={(e) => handleSetPerPage(parseInt(e.target.value), image)}
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
