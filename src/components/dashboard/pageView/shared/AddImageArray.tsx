"use client";
// packages
import { useDisclosure } from "@heroui/react";
import { UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";
// components
import SelectImageModal from "./SelectImageModal";
// types
import { CaseStudyFromType, SegmentFormType } from "@/lib/types";

const AddImageArray = ({
	imageAppendSegment,
	imageAppendCaseStudy,
	setValue,
	currentImage,
}: Readonly<{
	imageAppendSegment?: UseFieldArrayAppend<SegmentFormType, "image">;
	imageAppendCaseStudy?: UseFieldArrayAppend<CaseStudyFromType, "image">;
	setValue?: UseFormSetValue<CaseStudyFromType>;
	currentImage?: string;
}>) => {
	const { isOpen, onOpenChange } = useDisclosure();

	const handleReturnURL = (url: string) => {
		imageAppendSegment && imageAppendSegment({ url: url });
		imageAppendCaseStudy && imageAppendCaseStudy({ url: url });
		setValue && setValue("videoThumbnail", url);
		onOpenChange();
	};

	const handleImageType = () => {
		if (setValue) {
			return "THUMBNAIL";
		}
		if (imageAppendSegment) {
			return "SEGMENT";
		}
		return "STUDY";
	};

	return (
		<>
			<button
				type="button"
				onClick={onOpenChange}
				className="min-h-14 cursor-pointer w-full h-full bg-black hover:bg-opacity-25 transition-all bg-opacity-75 top-0 left-0"
			>
				<div className="flex h-full justify-center">
					<i aria-hidden className="m-auto fa-solid fa-plus fa-2xl" />
				</div>
			</button>
			<SelectImageModal
				currentImage={currentImage}
				returnURL={handleReturnURL}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				imageType={handleImageType()}
			/>
		</>
	);
};

export default AddImageArray;
