"use client";
import { Dispatch, SetStateAction } from "react";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Pagination } from "@heroui/react";

const MediaPaginationControl = ({
	image,
	getLength,
	getPerPage,
	getPage,
	setPage,
}: Readonly<{
	image: boolean;
	getLength?: number;
	getPerPage?: number;
	getPage?: number;
	setPage?: Dispatch<SetStateAction<number>>;
}>) => {
	const { getMediaLength, getMediaPage, setMediaPage, getMediaPerPage } =
		useMediaState();

	const warningString =
		"Component needs to be in media provider or have props set.";

	const handleGetMediaLength = () => {
		if (getMediaLength) {
			return getMediaLength(image);
		} else if (getLength) {
			return getLength;
		}
		throw warningString;
	};

	const handleGetMediaPerPage = () => {
		if (getMediaPerPage) {
			return getMediaPerPage(image);
		} else if (getPerPage) {
			return getPerPage;
		}
		throw warningString;
	};

	const handleGetPage = () => {
		if (getMediaPage) {
			return getMediaPage(image);
		} else if (getPage) {
			return getPage;
		}
		throw warningString;
	};

	const handleSetMediaPage = (page: number) => {
		if (setMediaPage) {
			return setMediaPage(page, image);
		} else if (setPage) {
			return setPage(page);
		}
		throw warningString;
	};

	return (
		<div className="flex justify-center">
			<Pagination
				className="dark mt-auto"
				classNames={{
					cursor: "bg-orange-600",
				}}
				showControls
				total={Math.ceil(
					handleGetMediaLength() / handleGetMediaPerPage()
				)}
				page={handleGetPage()}
				onChange={(page) => handleSetMediaPage(page)}
			/>
		</div>
	);
};

export default MediaPaginationControl;
