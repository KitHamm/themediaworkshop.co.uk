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
	const { imagesPerPage, videosPerPage, setImagesPerPage, setVideosPerPage } =
		useMediaState();
	const label = image ? "Images" : "Videos";

	const errorString = "Component needs to be in media context or set props";

	const handleGetMediaPerPage = () => {
		if (imagesPerPage != null && videosPerPage != null) {
			return image ? imagesPerPage : videosPerPage;
		}

		if (perPage != null) {
			return perPage;
		}

		throw new Error(errorString);
	};

	const handleSetPerPage = (value: number) => {
		if (setImagesPerPage != null && setVideosPerPage != null) {
			return image ? setImagesPerPage(value) : setVideosPerPage(value);
		}

		if (setPerPage != null) {
			setPerPage(value);
			return;
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
			selectedKeys={[handleGetMediaPerPage().toString()]}
			labelPlacement="outside"
			label={`${label} Per Page`}
			onChange={(e) => handleSetPerPage(parseInt(e.target.value))}
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
