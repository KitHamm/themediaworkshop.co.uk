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
import { Images } from "@prisma/client";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { DashboardStateContext } from "../DashboardStateProvider";
import { imageSort, itemOrder } from "@/lib/functions";
import SegmentAddImageUploadButton from "../Uploads/SegmentAddImageUploadButton";

export default function SegmentImagesModal(props: {
    isOpenAddImage: boolean;
    onOpenChangeAddImage: any;
    images: Images[];
    imageAppend: any;
    prefixCheck: string;
}) {
    const {
        segmentImageNamingError,
        uploading,
        uploadProgress,
        notImageError,
        sizeError,
        setSegmentImageNamingError,
        setNotImageError,
        setSizeError,
    } = useContext(DashboardStateContext);
    const [availableImages, setAvailableImages] = useState<Images[]>(
        imageSort(props.images, [], props.prefixCheck)
    );

    useEffect(() => {
        setAvailableImages(imageSort(props.images, [], props.prefixCheck));
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
            isDismissable={false}
            hideCloseButton
            size="5xl"
            backdrop="blur"
            isOpen={props.isOpenAddImage}
            className="dark"
            scrollBehavior="inside"
            onOpenChange={props.onOpenChangeAddImage}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <div className="w-full text-center font-bold">
                                Select or Upload Image
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {segmentImageNamingError && (
                                <div className="text-center text-red-400">
                                    File name prefix should be{" "}
                                    {props.prefixCheck === "segment"
                                        ? "SEGMENT_"
                                        : "CASESTUDY_"}
                                </div>
                            )}
                            {notImageError && (
                                <div className="w-full text-center text-red-400">
                                    Please Upload file in video format.
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
                                        showValueLabel={true}
                                        value={uploadProgress}
                                        color="warning"
                                        aria-label="Loading..."
                                    />
                                ) : (
                                    <>
                                        <SegmentAddImageUploadButton
                                            onOpenChange={
                                                props.onOpenChangeAddImage
                                            }
                                            imageAppend={props.imageAppend}
                                            check={
                                                props.prefixCheck === "segment"
                                                    ? "SEGMENT"
                                                    : "CASESTUDY"
                                            }
                                            format="image"
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
                                    (image: Images, index: number) => {
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
                                                        props.imageAppend({
                                                            url: image.name,
                                                        });
                                                        onClose();
                                                    }}>
                                                    <Image
                                                        height={300}
                                                        width={300}
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_CDN +
                                                            "/images/" +
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
                                color="danger"
                                className="rounded-md"
                                onPress={() => {
                                    setSegmentImageNamingError(false);
                                    setNotImageError(false);
                                    setSizeError(false);
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
