"use client";
// packages
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useState } from "react";
// components
import MediaUploadButton from "@/components/shared/MediaUploadButton";

const imageNames: { for: string; name: string }[] = [
	{ for: "Section Headers", name: "SEGHEAD_" },
	{ for: "Section Images", name: "SEGMENT_" },
	{ for: "Case Study Images", name: "STUDY_" },
	{ for: "Logo Images", name: "LOGO_" },
	{ for: "Video Thumbnail", name: "THUMBNAIL_" },
];

const videoNames: { for: string; name: string }[] = [
	{ for: "Background Videos", name: "HEADER_" },
	{ for: "Other Videos", name: "VIDEO_" },
];

const MediaUploadButtonModal = () => {
	const { isOpen, onOpenChange } = useDisclosure();
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleReturnError = (error: string) => {
		if (error !== "success") {
			setUploadError(error);
		} else {
			setUploadError(null);
		}
	};

	return (
		<>
			<Button
				onPress={onOpenChange}
				className="rounded-md text-md text-white bg-orange-600"
			>
				Upload Media
			</Button>
			<Modal
				hideCloseButton
				size="2xl"
				backdrop="blur"
				isOpen={isOpen}
				className="dark"
				isDismissable={false}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex justify-center">
								Upload New Media
							</ModalHeader>
							<ModalBody>
								<div className="mx-auto">
									<div className="text-center text-2xl font-bold">
										Naming Conventions
									</div>
									<div className="px-4 xl:text-base text-sm">
										<div className=" mt-4">
											When uploading new media please
											follow these naming conventions to
											make sure the media is served in the
											correct way and is visible on all
											areas of the site.
										</div>
										<div className="mt-2">
											All files should be prefixed with
											the correct keyword (listed below)
											and contain no other special
											characters. Specifically hyphens (-)
										</div>
										<div className="mt-2">
											<strong>For example:</strong>{" "}
											HEADER_NameOfImage.ext
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
													Images
												</div>
												{imageNames.map((imageName) => (
													<div
														key={imageName.for}
														className="flex gap-2"
													>
														<div className="font-bold">
															{imageName.for}:
														</div>
														<div className="font-normal">
															{imageName.name}
														</div>
													</div>
												))}
											</div>
											<div>
												<div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
													Videos
												</div>
												{videoNames.map((videoName) => (
													<div
														key={videoName.for}
														className="flex gap-2"
													>
														<div className="font-bold">
															{videoName.for}:
														</div>
														<div className="font-normal">
															{videoName.name}
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
								{uploadError && (
									<div className="text-center text-red-400">
										{uploadError}
									</div>
								)}

								{isOpen && (
									<MediaUploadButton
										onOpenChange={onOpenChange}
										returnError={handleReturnError}
										isMediaPage
									/>
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default MediaUploadButtonModal;
