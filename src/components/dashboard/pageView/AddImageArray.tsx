"use client";

import { useDisclosure } from "@nextui-org/react";
import SelectImageModal from "./SelectImageModal";
import { UseFieldArrayAppend } from "react-hook-form";
import { SegmentFormType } from "@/lib/types";

export default function AddImageArray(props: {
    imageAppend: UseFieldArrayAppend<SegmentFormType, "image">;
}) {
    const { imageAppend } = props;
    const { isOpen, onOpenChange } = useDisclosure();

    function handleReturnURL(url: string) {
        imageAppend({ url: url });
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
                returnURL={handleReturnURL}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                imageType="SEGMENT"
            />
        </>
    );
}
