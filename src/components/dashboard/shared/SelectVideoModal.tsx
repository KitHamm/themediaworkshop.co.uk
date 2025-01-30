"use client";
// context
import { useMediaFiles } from "../pageView/MediaFIlesProvider";
import { usePageHeaderState } from "../pageView/mainView/HeaderStateProvider";
// packages
import { useEffect, useState } from "react";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { UseFormSetValue } from "react-hook-form";
// functions
import { itemOrder, videoSort } from "@/lib/functions";
import { inPaginationRange } from "@/lib/utils/mediaUtils/inPaginationRange";
// components
import MediaUploadButton from "@/components/shared/MediaUploadButton";
import MediaPerPageSelect from "../mediaView/MediaPerPageSelect";
import MediaSortBySelect from "../mediaView/MediaSortBySelect";
import MediaOrderSelect from "../mediaView/MediaOrderSelect";
import MediaPaginationControl from "../mediaView/MediaPaginationControl";
import VideoPreview from "../pageView/mainView/VideoPreviewModal";
// types
import { Videos } from "@prisma/client";
import { MediaType } from "@/lib/constants";
import { CaseStudyFromType, PageFormType } from "@/lib/types";

const SelectVideoModal = ({
	formTarget,
	setValueCaseStudy,
	isOpen,
	onOpenChange,
	currentVideo,
}: Readonly<{
	formTarget?: keyof PageFormType;
	setValueCaseStudy?: UseFormSetValue<CaseStudyFromType>;
	isOpen: boolean;
	onOpenChange: () => void;
	currentVideo?: string;
}>) => {
	const { setValue } = usePageHeaderState();
	const { videos } = useMediaFiles();

	const titleFromTarget = () => {
		if (!formTarget) {
			return null;
		}
		return formTarget
			.replace(/([A-Z])/g, " $1")
			.replace(/(\d)/g, " $1")
			.trim();
	};

	const [uploadError, setUploadError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [videosPerPage, setVideosPerPage] = useState(8);
	const [sortBy, setSortBy] = useState("date");
	const [order, setOrder] = useState("desc");
	const [availableVideos, setAvailableVideos] = useState<Videos[]>(
		itemOrder(
			videoSort(
				videos,
				formTarget === "backgroundVideo" ? "HEADER" : "VIDEO"
			),
			sortBy,
			order
		)
	);

	useEffect(() => {
		setAvailableVideos(
			videoSort(
				videos,
				formTarget === "backgroundVideo" ? "HEADER" : "VIDEO"
			)
		);
	}, [videos]);

	useEffect(() => {
		setAvailableVideos(itemOrder(availableVideos, sortBy, order));
	}, [sortBy, order]);

	useEffect(() => {
		setCurrentPage(1);
	}, [videosPerPage]);

	const handleSetValue = (returnedURL: string) => {
		if (formTarget) {
			setValue(formTarget, returnedURL, { shouldDirty: true });
		}
		if (setValueCaseStudy) {
			setValueCaseStudy("video", returnedURL, { shouldDirty: true });
		}
	};

	const handleReturnError = (error: string) => {
		setUploadError(error);
	};

	function handleReturnClose() {
		setUploadError(null);
		onOpenChange();
	}

	const handleSelect = (value: string) => {
		handleSetValue(value);
		handleClose();
	};

	const handleClose = () => {
		setCurrentPage(1);
		onOpenChange();
	};

	return (
		<Modal
			hideCloseButton
			size="5xl"
			backdrop="blur"
			isOpen={isOpen}
			className="dark"
			scrollBehavior="inside"
			isDismissable={false}
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<div className="capitalize w-full text-center font-bold text-3xl">
								{titleFromTarget()}
							</div>
						</ModalHeader>
						<ModalBody>
							<div className="flex flex-col mx-auto bg-neutral-800 rounded p-4 w-full mb-4 xl:w-1/2 gap-4">
								{uploadError && (
									<div className="mx-auto text-red-500">
										{uploadError}
									</div>
								)}
								<MediaUploadButton
									mediaType={
										formTarget === "backgroundVideo"
											? MediaType.HEADER
											: MediaType.VIDEO
									}
									onOpenChange={handleReturnClose}
									returnURL={handleSetValue}
									returnError={handleReturnError}
								/>
							</div>
							<div className="flex justify-evenly gap-12 mt-4">
								<MediaPerPageSelect
									image={false}
									perPage={videosPerPage}
									setPerPage={setVideosPerPage}
								/>
								<MediaSortBySelect
									image={false}
									getSortBy={sortBy}
									setSortBy={setSortBy}
								/>
								<MediaOrderSelect
									image={false}
									getOrderBy={order}
									setOrderBy={setOrder}
								/>
							</div>
							<div className="flex justify-center grow">
								<MediaPaginationControl
									image={false}
									getLength={availableVideos.length}
									getPerPage={videosPerPage}
									getPage={currentPage}
									setPage={setCurrentPage}
								/>
							</div>
							<div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
								{availableVideos.map(
									(video: Videos, index: number) => {
										if (
											inPaginationRange(
												index,
												currentPage,
												videosPerPage
											)
										) {
											return (
												<div key={video.name}>
													<VideoPreview
														videoUrl={video.name}
													/>
													<div className="text-center truncate">
														{
															video.name
																.split("-")[0]
																.split("_")[1]
														}
													</div>
													<div className="flex justify-center mt-2">
														<button
															onClick={() => {
																handleSelect(
																	video.name
																);
															}}
															className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded"
														>
															Select
														</button>
													</div>
												</div>
											);
										}
									}
								)}
							</div>
						</ModalBody>
						<ModalFooter className="mt-4">
							{currentVideo && (
								<Button
									color="danger"
									variant="light"
									onPress={() => {
										handleSelect("");
									}}
									className="xl:px-10 px-4 py-2 rounded-md"
								>
									Remove Video
								</Button>
							)}
							<Button
								className="rounded-md bg-orange-600"
								onPress={handleClose}
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default SelectVideoModal;
