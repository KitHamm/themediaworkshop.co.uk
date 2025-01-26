"use client";

import { useDisclosure } from "@heroui/react";
import SelectImageModal from "./SelectImageModal";
import { UseFieldArrayAppend, UseFormSetValue } from "react-hook-form";
import { CaseStudyFromType, SegmentFormType } from "@/lib/types";

export default function AddImageArray(props: {
    imageAppendSegment?: UseFieldArrayAppend<SegmentFormType, "image">;
    imageAppendCaseStudy?: UseFieldArrayAppend<CaseStudyFromType, "image">;
    setValue?: UseFormSetValue<CaseStudyFromType>;
    currentImage?: string;
}) {
    const { imageAppendSegment, imageAppendCaseStudy, currentImage, setValue } =
        props;
    const { isOpen, onOpenChange } = useDisclosure();

    function handleReturnURL(url: string) {
        imageAppendSegment && imageAppendSegment({ url: url });
        imageAppendCaseStudy && imageAppendCaseStudy({ url: url });
        setValue && setValue("videoThumbnail", url);
        onOpenChange();
    }

    return (
        <>
            <div
                onClick={() => {
                    onOpenChange();
                }}
                className="min-h-14 cursor-pointer w-full h-full bg-black hover:bg-opacity-25 transition-all bg-opacity-75 top-0 left-0">
                <div className="flex h-full justify-center">
                    <i aria-hidden className="m-auto fa-solid fa-plus fa-2xl" />
                </div>
            </div>
            <SelectImageModal
                currentImage={currentImage}
                returnURL={handleReturnURL}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                imageType={
                    setValue
                        ? "THUMBNAIL"
                        : imageAppendSegment
                        ? "SEGMENT"
                        : "STUDY"
                }
            />
        </>
    );
}
