"use client";
// packages
import { useEffect, useState } from "react";
import Image from "next/image";
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
// context
import { useMediaState } from "./MediaStateProvider";
// functions
import { inPaginationRange } from "@/lib/utils/mediaUtils/inPaginationRange";
// components
import ConfirmDeleteMedia from "./ConfirmDeleteMedia";
// types
import { Images, Logos } from "@prisma/client";
import { errorResponse } from "@/lib/types";

const ImageDisplay = () => {
	const { selectedImages, imagePage, imagesPerPage } = useMediaState();

	const { isOpen, onOpenChange, onClose: onCloseMain } = useDisclosure();

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [deleteErrorArray, setDeleteErrorArray] = useState<errorResponse[]>(
		[]
	);

	const handleOpenPreview = (image: string) => {
		setSelectedImage(image);
		onOpenChange();
	};

	useEffect(() => {
		console.log(selectedImage);
	}, [selectedImage]);

	return (
		<div className="grid xl:grid-cols-4 grid-cols-2 gap-4 bg-neutral-800 border-solid border-2 border-neutral-600 p-4 rounded">
			{selectedImages.map((image: Images | Logos, index: number) => {
				if (inPaginationRange(index, imagePage, imagesPerPage)) {
					return (
						<Tooltip
							delay={500}
							placement="bottom"
							className="dark"
							key={image.name}
							content={image.name}
						>
							<div className="fade-in flex flex-col border rounded border-neutral-800">
								<div
									onClick={() => {
										handleOpenPreview(image.name);
									}}
									className="cursor-pointer bg-neutral-600 bg-opacity-25 p-4 h-full flex w-full"
								>
									<Image
										height={100}
										width={100}
										src={
											image.name.split("_")[0] === "LOGO"
												? process.env.NEXT_PUBLIC_CDN +
												  "/logos/" +
												  image.name
												: process.env.NEXT_PUBLIC_CDN +
												  "/images/" +
												  image.name
										}
										alt={image.name}
										className="w-full h-auto m-auto"
									/>
								</div>
								<div className="bg-neutral-800 bg-opacity-25">
									<div
										id={image.name}
										className="text-center truncate p-2"
									>
										{image.name.split("-")[0].split("_")[1]}
									</div>
								</div>
							</div>
						</Tooltip>
					);
				}
			})}
			{selectedImage && (
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
									{selectedImage.split("-")[0] +
										"." +
										selectedImage.split(".")[1]}
								</ModalHeader>
								<ModalBody>
									<div>
										<Image
											height={1000}
											width={1000}
											src={
												selectedImage.split("_")[0] ===
												"LOGO"
													? process.env
															.NEXT_PUBLIC_CDN +
													  "/logos/" +
													  selectedImage
													: process.env
															.NEXT_PUBLIC_CDN +
													  "/images/" +
													  selectedImage
											}
											alt={selectedImage}
											className="max-w-full m-auto h-auto"
										/>
									</div>
								</ModalBody>
								<ModalFooter>
									<ConfirmDeleteMedia
										buttonText="Delete Image"
										onCloseMain={onCloseMain}
										deleteErrorArray={deleteErrorArray}
										setDeleteErrorArray={
											setDeleteErrorArray
										}
										fileToDelete={selectedImage}
									/>
									<a
										target="_blank"
										rel="noreferrer"
										className="transition-all hover:bg-opacity-85 text-sm bg-orange-600 flex items-center px-2 py-1 rounded-md"
										href={
											selectedImage.split("_")[0] ===
											"LOGO"
												? process.env.NEXT_PUBLIC_CDN +
												  "/logos/" +
												  selectedImage
												: process.env.NEXT_PUBLIC_CDN +
												  "/images/" +
												  selectedImage
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

export default ImageDisplay;
