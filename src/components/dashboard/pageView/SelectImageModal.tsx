"use client";
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
import Image from "next/image";
// context
import { useMediaFiles } from "./MediaFIlesProvider";
// functions
import { imageSort, itemOrder } from "@/lib/functions";
import { inPaginationRange } from "@/lib/utils/mediaUtils/inPaginationRange";
// components
import MediaUploadButton from "@/components/shared/MediaUploadButton";
import MediaPerPageSelect from "../mediaView/MediaPerPageSelect";
import MediaSortBySelect from "../mediaView/MediaSortBySelect";
import MediaOrderSelect from "../mediaView/MediaOrderSelect";
import MediaPaginationControl from "../mediaView/MediaPaginationControl";
// types
import { Images } from "@prisma/client";
import { MediaType } from "@/lib/constants";

const SelectImageModal = ({
	isOpen,
	onOpenChange,
	imageType,
	returnURL,
	currentImage,
}: Readonly<{
	isOpen: boolean;
	onOpenChange: () => void;
	imageType: "SEGHEAD" | "SEGMENT" | "STUDY" | "THUMBNAIL";
	returnURL: (url: string) => void;
	currentImage?: string;
}>) => {
	const { images } = useMediaFiles();

	const [currentPage, setCurrentPage] = useState(1);
	const [imagesPerPage, setImagesPerPage] = useState(8);
	const [sortBy, setSortBy] = useState("date");
	const [order, setOrder] = useState("desc");
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [availableImages, setAvailableImages] = useState<Images[]>(
		itemOrder(imageSort(images, [], imageType), sortBy, order)
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [imagesPerPage]);

	useEffect(() => {
		setAvailableImages(imageSort(images, [], imageType));
	}, [images]);

	useEffect(() => {
		setAvailableImages(itemOrder(availableImages, sortBy, order));
	}, [sortBy, order]);

	function titleFromTarget() {
		switch (imageType) {
			case "SEGHEAD":
				return "Header Image";
			case "SEGMENT":
				return "Segment Image";
			case "STUDY":
				return "Case Study Image";
			case "THUMBNAIL":
				return "Thumbnail Image";
		}
	}

	const mediaTypeFromImageType = () => {
		switch (imageType) {
			case "SEGHEAD":
				return MediaType.SEGHEAD;
			case "SEGMENT":
				return MediaType.SEGMENT;
			case "STUDY":
				return MediaType.STUDY;
			case "THUMBNAIL":
				return MediaType.THUMBNAIL;
		}
	};

	const handleReturnError = (error: string) => {
		if (error !== "success" && error !== "") {
			setUploadError(error);
		} else {
			setUploadError(null);
		}
	};

	const getImageUrl = (image: string) => {
		const folder = image.split("_")[0] === "LOGO" ? "/logos/" : "/images/";
		return process.env.NEXT_PUBLIC_CDN + folder + image;
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
							<div className="w-full text-center font-bold text-3xl">
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
									mediaType={mediaTypeFromImageType()}
									onOpenChange={onOpenChange}
									returnURL={returnURL}
									returnError={handleReturnError}
								/>
							</div>
							<div className="flex justify-evenly gap-12 mt-4">
								<MediaPerPageSelect
									image
									perPage={imagesPerPage}
									setPerPage={setImagesPerPage}
								/>
								<MediaSortBySelect
									image
									getSortBy={sortBy}
									setSortBy={setSortBy}
								/>
								<MediaOrderSelect
									image
									getOrderBy={order}
									setOrderBy={setOrder}
								/>
							</div>
							<div className="flex justify-center grow">
								<MediaPaginationControl
									image
									getLength={availableImages.length}
									getPerPage={imagesPerPage}
									getPage={currentPage}
									setPage={setCurrentPage}
								/>
							</div>
							<div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
								{availableImages.map(
									(image: Images, index: number) => {
										if (
											inPaginationRange(
												index,
												currentPage,
												imagesPerPage
											)
										) {
											return (
												<div key={image.name}>
													<button
														type="button"
														onClick={() => {
															console.log(
																"clicked"
															);
															returnURL(
																image.name
															);
															onOpenChange();
														}}
														className="cursor-pointer m-auto flex my-4"
													>
														<Image
															height={200}
															width={200}
															src={getImageUrl(
																image.name
															)}
															alt={image.name}
															className="w-full h-auto m-auto"
														/>
													</button>
												</div>
											);
										}
									}
								)}
							</div>
						</ModalBody>
						<ModalFooter className="mt-4">
							{currentImage && (
								<Button
									type="button"
									color="danger"
									variant="light"
									className="rounded-md"
									onPress={() => {
										returnURL("");
										onClose();
									}}
								>
									Remove Image
								</Button>
							)}
							<Button
								type="button"
								color="danger"
								className="rounded-md"
								onPress={() => {
									setCurrentPage(1);
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
	);
};

export default SelectImageModal;
