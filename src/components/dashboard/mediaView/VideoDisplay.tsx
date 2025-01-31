"use client";
// packages
import { useState } from "react";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Tooltip,
	useDisclosure,
} from "@heroui/react";
import Image from "next/image";
// context
import { useMediaState } from "./MediaStateProvider";
// functions
import { inPaginationRange } from "@/lib/utils/mediaUtils/inPaginationRange";
// components
import ConfirmDeleteMedia from "./ConfirmDeleteMedia";
// types
import { Videos } from "@prisma/client";
import { errorResponse } from "@/lib/types";

const VideoDisplay = () => {
	const { selectedVideos, videoPage, videosPerPage } = useMediaState();

	const { isOpen, onOpenChange, onClose: onCloseMain } = useDisclosure();

	const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
	const [deleteErrorArray, setDeleteErrorArray] = useState<errorResponse[]>(
		[]
	);

	const handleOpenPreview = (video: string) => {
		setSelectedVideo(video);
		onOpenChange();
	};

	return (
		<div className="grid xl:grid-cols-4 grid-cols-2 gap-4 bg-neutral-800 border-solid border-2 border-neutral-600 p-4 rounded">
			{selectedVideos.map((video: Videos, index: number) => {
				if (inPaginationRange(index, videoPage, videosPerPage)) {
					return (
						<Tooltip
							delay={500}
							className="dark"
							placement="bottom"
							key={video.name}
							content={video.name.split("-")[0].split("_")[1]}
						>
							<div className="flex flex-col border rounded border-neutral-800">
								<div
									onClick={() => {
										handleOpenPreview(video.name);
									}}
									className="cursor-pointer bg-black bg-opacity-25 p-4 h-full flex w-full"
								>
									<Image
										height={100}
										width={100}
										src={"/images/play.png"}
										alt="play"
										className="xl:w-full h-auto m-auto"
									/>
								</div>
								<div className="bg-neutral-800 bg-opacity-25">
									<div className="text-center truncate p-2 h-full">
										{video.name.split("-")[0].split("_")[1]}
									</div>
								</div>
							</div>
						</Tooltip>
					);
				}
			})}
			{selectedVideo && (
				<Modal
					size="5xl"
					backdrop="blur"
					isOpen={isOpen}
					className="dark"
					onOpenChange={onOpenChange}
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader>
									{selectedVideo.split("-")[0] +
										"." +
										selectedVideo.split(".")[1]}
								</ModalHeader>
								<ModalBody>
									<div>
										<video
											autoPlay
											playsInline
											disablePictureInPicture
											id="bg-video"
											controls={true}
											src={
												process.env.NEXT_PUBLIC_CDN +
												"/videos/" +
												selectedVideo
											}
										/>
									</div>
								</ModalBody>
								<ModalFooter>
									<ConfirmDeleteMedia
										buttonText="Delete Video"
										onCloseMain={onCloseMain}
										deleteErrorArray={deleteErrorArray}
										setDeleteErrorArray={
											setDeleteErrorArray
										}
										fileToDelete={selectedVideo}
									/>
									<a
										target="_blank"
										rel="noreferrer"
										className="transition-all hover:bg-opacity-85 text-sm bg-orange-600 flex items-center px-2 py-1 rounded-md"
										href={
											process.env.NEXT_PUBLIC_CDN +
											"/videos/" +
											selectedVideo
										}
										download
									>
										Download
									</a>
									<Button
										className="rounded-md"
										color="danger"
										onPress={() => {
											onClose();
										}}
									>
										Close
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};

export default VideoDisplay;
