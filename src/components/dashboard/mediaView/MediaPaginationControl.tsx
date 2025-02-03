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
	const {
		selectedImages,
		selectedVideos,
		imagesPerPage,
		videosPerPage,
		imagePage,
		videoPage,
		setImagePage,
		setVideoPage,
	} = useMediaState();

	const warningString =
		"Component needs to be in media provider or have props set.";

	const handleGetMediaLength = () => {
		if (selectedImages != null && selectedVideos != null) {
			return image ? selectedImages.length : selectedVideos.length;
		}

		if (getLength) {
			return getLength;
		}
		throw warningString;
	};

	const handleGetMediaPerPage = () => {
		if (imagesPerPage != null && videosPerPage != null) {
			return image ? imagesPerPage : videosPerPage;
		}

		if (getPerPage) {
			return getPerPage;
		}
		throw warningString;
	};

	const handleGetPage = () => {
		if (imagePage != null && videoPage != null) {
			return image ? imagePage : videoPage;
		}

		if (getPage) {
			return getPage;
		}
		throw warningString;
	};

	const handleSetMediaPage = (page: number) => {
		if (setImagePage != null && setVideoPage != null) {
			return image ? setImagePage(page) : setVideoPage(page);
		}
		if (setPage) {
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
