"use client";

import {
    Select,
    SelectItem,
    Button,
    CircularProgress,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
} from "@nextui-org/react";
import Image from "next/image";
import { DashboardStateContext } from "../DashboardStateProvider";
import { useContext, useEffect, useState } from "react";
import { imageSort, itemOrder } from "@/lib/functions";
import { Images } from "@prisma/client";
import SegmentTopImageUploadButton from "../Uploads/SegmentTopImageUploadButton";

export default function CaseStudyThumbnailModal(props: {
    isOpenThumbnailSelect: boolean;
    onOpenChangeThumbnailSelect: any;
    setValue: any;
    images: Images[];
    setThumbnailImage: any;
}) {
    const {
        imageNamingError,
        setImageNamingError,
        notImageError,
        setNotImageError,
        sizeError,
        setSizeError,
        uploading,
        uploadProgress,
    } = useContext(DashboardStateContext);

    const [availableImages, setAvailableImages] = useState(
        imageSort(props.images, [], "thumbnails")
    );

    useEffect(() => {
        setAvailableImages(imageSort(props.images, [], "thumbnails"));
    }, [props.images]);

    const [currentPage, setCurrentPage] = useState(1);
    const [imagesPerPage, setImagesPerPage] = useState(8);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        setAvailableImages(itemOrder(availableImages, sortBy, order));
    }, [sortBy, order]);

    return (
        <Modal
            hideCloseButton
            size="5xl"
            backdrop="blur"
            isOpen={props.isOpenThumbnailSelect}
            className="dark"
            scrollBehavior="inside"
            isDismissable={false}
            onOpenChange={props.onOpenChangeThumbnailSelect}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <div className="w-full text-center font-bold">
                                Select or Upload Image
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {imageNamingError && (
                                <div className="text-center text-red-400">
                                    File name prefix should be THUMBNAIL_
                                </div>
                            )}
                            {notImageError && (
                                <div className="w-full text-center text-red-400">
                                    Please Upload file in image format.
                                </div>
                            )}
                            {sizeError && (
                                <div className="w-full text-center text-red-400">
                                    File size too large.
                                </div>
                            )}
                            <div className="w-full flex justify-center mb-10">
                                {uploading ? (
                                    <CircularProgress
                                        classNames={{
                                            svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                            value: "text-xl",
                                        }}
                                        className="m-auto"
                                        showValueLabel={true}
                                        value={uploadProgress}
                                        color="warning"
                                        aria-label="Loading..."
                                    />
                                ) : (
                                    <>
                                        <SegmentTopImageUploadButton
                                            check="THUMBNAIL"
                                            format="image"
                                            setValue={props.setValue}
                                            setTopImage={
                                                props.setThumbnailImage
                                            }
                                            onOpenChange={
                                                props.onOpenChangeThumbnailSelect
                                            }
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-evenly gap-12 mt-4">
                                <Select
                                    className="dark ms-auto me-auto xl:me-0"
                                    classNames={{
                                        popoverContent: "bg-neutral-600",
                                    }}
                                    variant="bordered"
                                    selectedKeys={[imagesPerPage.toString()]}
                                    labelPlacement="outside"
                                    label={"Images Per Page"}
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
                                    onChange={(e) => setSortBy(e.target.value)}>
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
                                    onChange={(e) => setOrder(e.target.value)}>
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
                            <div className="flex justify-center">
                                <Pagination
                                    className="dark mt-auto"
                                    classNames={{
                                        cursor: "bg-orange-600",
                                    }}
                                    showControls
                                    total={Math.ceil(
                                        availableImages.length / imagesPerPage
                                    )}
                                    page={currentPage}
                                    onChange={setCurrentPage}
                                />
                            </div>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
                                {availableImages.map(
                                    (image: any, index: number) => {
                                        if (
                                            index >
                                                currentPage * imagesPerPage -
                                                    (imagesPerPage + 1) &&
                                            index < currentPage * imagesPerPage
                                        )
                                            return (
                                                <div
                                                    key={
                                                        image.name + "-" + index
                                                    }
                                                    className="flex cursor-pointer"
                                                    onClick={() => {
                                                        props.setValue(
                                                            "videoThumbnail",
                                                            image.name,
                                                            {
                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );
                                                        props.setThumbnailImage(
                                                            image.name
                                                        );
                                                        onClose();
                                                    }}>
                                                    <Image
                                                        height={300}
                                                        width={300}
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                            image.name
                                                        }
                                                        alt={image.name}
                                                        className="w-full h-auto m-auto"
                                                    />
                                                </div>
                                            );
                                    }
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="rounded-md"
                                color="danger"
                                onPress={() => {
                                    onClose();
                                }}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
