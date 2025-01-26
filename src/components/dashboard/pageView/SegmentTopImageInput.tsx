"use client";

import { SegmentFormType } from "@/lib/types";
import { useDisclosure } from "@heroui/react";
import Image from "next/image";
import { UseFormSetValue } from "react-hook-form";
import SelectImageModal from "./SelectImageModal";
import { Images } from "@prisma/client";

export default function SegmentTopImageInput(props: {
    headerImage: string;
    setValue: UseFormSetValue<SegmentFormType>;
}) {
    const { headerImage, setValue } = props;

    const {
        isOpen: isOpenSelectHeader,
        onOpenChange: onOpenChangeSelectHeader,
    } = useDisclosure();

    function handleSetValue(returnedURL: string) {
        setValue("headerImage", returnedURL, { shouldDirty: true });
    }

    return (
        <>
            {headerImage ? (
                <div className="relative my-2">
                    <Image
                        height={2000}
                        width={1000}
                        src={
                            process.env.NEXT_PUBLIC_CDN +
                            "/images/" +
                            headerImage
                        }
                        alt={headerImage}
                        className="w-full h-auto m-auto"
                    />
                    <div className="hover:opacity-100 flex justify-center transition-opacity opacity-0 absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                        <div className="m-auto flex w-1/2 justify-evenly">
                            <div className="w-1/2 text-center">
                                <i
                                    onClick={() => {
                                        onOpenChangeSelectHeader();
                                    }}
                                    aria-hidden
                                    className="fa-solid cursor-pointer fa-pen-to-square fa-2xl"
                                />
                            </div>
                            <div className="w-1/2 text-center">
                                <i
                                    onClick={() => {
                                        setValue("headerImage", "", {
                                            shouldDirty: true,
                                        });
                                    }}
                                    aria-hidden
                                    className="fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full  my-10">
                    <div className="flex justify-center">
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    onOpenChangeSelectHeader();
                                }}
                                className="bg-orange-600 py-3 px-20 rounded shadow-xl">
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <SelectImageModal
                currentImage={headerImage}
                isOpen={isOpenSelectHeader}
                onOpenChange={onOpenChangeSelectHeader}
                imageType="SEGHEAD"
                returnURL={handleSetValue}
            />
        </>
    );
}
