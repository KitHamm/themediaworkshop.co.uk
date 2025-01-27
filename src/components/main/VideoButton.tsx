"use client";
// packages
import { useDisclosure } from "@heroui/react";
// components
import VideoModal from "./modals/VideoModal";

const VideoButton = ({
	buttonText,
	videoURL,
}: {
	buttonText: string;
	videoURL: string;
}) => {
	const { isOpen, onOpenChange } = useDisclosure();
	return (
		<div id="homeButton">
			<button
				onClick={onOpenChange}
				className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 font-bold bg-orange-600 max-w-52 text-sm w-full xl:w-auto py-2 xl:px-8 xl:py-3"
			>
				{buttonText}
			</button>
			<VideoModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				videoURL={videoURL}
			/>
		</div>
	);
};

export default VideoButton;
