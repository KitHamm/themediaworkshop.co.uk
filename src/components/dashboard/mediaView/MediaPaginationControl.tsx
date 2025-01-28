"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Pagination } from "@heroui/react";

const MediaPaginationControl = ({ image }: Readonly<{ image: boolean }>) => {
	const { getMediaLength, getMediaPage, setMediaPage, getMediaPerPage } =
		useMediaState();
	return (
		<div className="flex justify-center">
			<Pagination
				className="dark mt-auto"
				classNames={{
					cursor: "bg-orange-600",
				}}
				showControls
				total={Math.ceil(
					getMediaLength(image) / getMediaPerPage(image)
				)}
				page={getMediaPage(image)}
				onChange={(page) => setMediaPage(page, image)}
			/>
		</div>
	);
};

export default MediaPaginationControl;
