"use client";

import MediaUploadButton from "@/components/shared/MediaUploadButton";
import { imageSort, itemOrder } from "@/lib/functions";
import { useContext } from "react";
import { MediaFilesContext } from "./MediaFIlesProvider";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
} from "@heroui/react";
import { Images } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MediaType } from "@/lib/constants";

export default function SelectImageModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    imageType: "SEGHEAD" | "SEGMENT" | "STUDY" | "THUMBNAIL";
    returnURL: (url: string) => void;
    currentImage?: string;
}) {
    const { isOpen, onOpenChange, imageType, returnURL, currentImage } = props;
    const { images, session } = useContext(MediaFilesContext);

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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [imagesPerPage, setImagesPerPage] = useState(8);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        setCurrentPage(1);
    }, [imagesPerPage]);

    const [availableImages, setAvailableImages] = useState<Images[]>(
        itemOrder(imageSort(images, [], imageType), sortBy, order)
    );

    const [uploadError, setUploadError] = useState<string | null>(null);

    function mediaTypeFromImageType() {
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
    }

    useEffect(() => {
        setAvailableImages(imageSort(images, [], imageType));
    }, [images]);

    useEffect(() => {
        setAvailableImages(itemOrder(availableImages, sortBy, order));
    }, [sortBy, order]);

    function handleReturnError(error: string) {
        if (error !== "success" && error !== "") {
            setUploadError(error);
        } else {
            setUploadError(null);
        }
    }

    return (
        <>
            <Modal
                hideCloseButton
                size="5xl"
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChange}>
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
                                    <Select
                                        className="dark ms-auto me-auto xl:me-0"
                                        classNames={{
                                            popoverContent: "bg-neutral-600",
                                        }}
                                        variant="bordered"
                                        selectedKeys={[
                                            imagesPerPage.toString(),
                                        ]}
                                        labelPlacement="outside"
                                        label={"Videos Per Page"}
                                        onChange={(e) =>
                                            setImagesPerPage(
                                                parseInt(e.target.value)
                                            )
                                        }>
                                        <SelectItem
                                            className="dark"
                                            key={8}
                                            value={8}>
                                            8
                                        </SelectItem>
                                        <SelectItem
                                            className="dark"
                                            key={12}
                                            value={12}>
                                            12
                                        </SelectItem>
                                        <SelectItem
                                            className="dark"
                                            key={16}
                                            value={16}>
                                            16
                                        </SelectItem>
                                        <SelectItem
                                            className="dark"
                                            key={20}
                                            value={20}>
                                            20
                                        </SelectItem>
                                        <SelectItem
                                            className="dark"
                                            key={1000000}
                                            value={1000000}>
                                            All
                                        </SelectItem>
                                    </Select>
                                    <Select
                                        className="dark ms-auto me-auto xl:me-0"
                                        classNames={{
                                            popoverContent: "bg-neutral-600",
                                        }}
                                        variant="bordered"
                                        selectedKeys={[sortBy.toString()]}
                                        labelPlacement="outside"
                                        label={"Sort by"}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }>
                                        <SelectItem
                                            className="dark"
                                            key={"date"}
                                            value={"date"}>
                                            Date
                                        </SelectItem>
                                        <SelectItem
                                            className="dark"
                                            key={"name"}
                                            value={"name"}>
                                            Name
                                        </SelectItem>
                                    </Select>
                                    <Select
                                        className="dark ms-auto me-auto xl:me-0"
                                        classNames={{
                                            popoverContent: "bg-neutral-600",
                                        }}
                                        variant="bordered"
                                        selectedKeys={[order.toString()]}
                                        labelPlacement="outside"
                                        label={"Order"}
                                        onChange={(e) =>
                                            setOrder(e.target.value)
                                        }>
                                        <SelectItem
                                            className="dark"
                                            key={"asc"}
                                            value={"asc"}>
                                            Ascending
                                        </SelectItem>
                                        <SelectItem
                                            className="dark"
                                            key={"desc"}
                                            value={"desc"}>
                                            Descending
                                        </SelectItem>
                                    </Select>
                                </div>
                                <div className="flex justify-center grow">
                                    <Pagination
                                        className="dark mt-auto"
                                        classNames={{
                                            cursor: "bg-orange-600",
                                        }}
                                        showControls
                                        total={Math.ceil(
                                            availableImages.length /
                                                imagesPerPage
                                        )}
                                        page={currentPage}
                                        onChange={setCurrentPage}
                                    />
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                    {availableImages.map(
                                        (image: Images, index: number) => {
                                            if (
                                                index >
                                                    currentPage *
                                                        imagesPerPage -
                                                        (imagesPerPage + 1) &&
                                                index <
                                                    currentPage * imagesPerPage
                                            ) {
                                                return (
                                                    <div
                                                        key={
                                                            image.name +
                                                            "-" +
                                                            index
                                                        }>
                                                        <div
                                                            onClick={() => {
                                                                returnURL(
                                                                    image.name
                                                                );
                                                                onOpenChange();
                                                            }}
                                                            className="cursor-pointer m-auto flex my-4">
                                                            <Image
                                                                height={200}
                                                                width={200}
                                                                src={
                                                                    image.name.split(
                                                                        "_"
                                                                    )[0] ===
                                                                    "LOGO"
                                                                        ? process
                                                                              .env
                                                                              .NEXT_PUBLIC_CDN +
                                                                          "/logos/" +
                                                                          image.name
                                                                        : process
                                                                              .env
                                                                              .NEXT_PUBLIC_CDN +
                                                                          "/images/" +
                                                                          image.name
                                                                }
                                                                alt={image.name}
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                        {session.user.name ===
                                                            "Kit Hamm" && (
                                                            <div>
                                                                {
                                                                    image.name.split(
                                                                        "."
                                                                    )[1]
                                                                }
                                                            </div>
                                                        )}
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
                                        color="danger"
                                        variant="light"
                                        className="rounded-md"
                                        onPress={() => {
                                            returnURL("");
                                            onClose();
                                        }}>
                                        Remove Image
                                    </Button>
                                )}
                                <Button
                                    color="danger"
                                    className="rounded-md"
                                    onPress={() => {
                                        setCurrentPage(1);
                                        onClose();
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
