"use client";

import { useContext, useEffect, useState } from "react";
import { DashboardStateContext } from "../DashboardStateProvider";
import { revalidateDashboard } from "@/components/server/revalidateDashboard";
import axios from "axios";
import {
    Button,
    CircularProgress,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
} from "@nextui-org/react";
import Image from "next/image";
import { Images } from "@prisma/client";
import { imageSort, itemOrder } from "@/lib/functions";
import SegmentTopImageUploadButton from "../Uploads/SegmentTopImageUploadButton";

export default function TopImageSelectModal(props: {
    isOpenTopImage: boolean;
    onOpenChangeTopImage: any;
    segmentTitle: string;
    images: Images[];
    setValue: any;
    setTopImage: any;
}) {
    const {
        uploading,
        uploadProgress,
        topImageNamingError,
        sizeError,
        notImageError,
        setTopImageNamingError,
        setSizeError,
        setNotImageError,
    } = useContext(DashboardStateContext);

    const [availableImages, setAvailableImages] = useState<Images[]>(
        imageSort(props.images, [], "header")
    );

    useEffect(() => {
        setAvailableImages(imageSort(props.images, [], "header"));
    }, [props.images]);

    // Pagination
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
            isOpen={props.isOpenTopImage}
            className="dark"
            scrollBehavior="inside"
            onOpenChange={props.onOpenChangeTopImage}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {"Top Image for " + props.segmentTitle}
                        </ModalHeader>
                        <ModalBody>
                            {notImageError && (
                                <div className="w-full text-center text-red-400">
                                    Please Upload file in video format.
                                </div>
                            )}
                            {topImageNamingError && (
                                <div className="w-full text-center text-red-400">
                                    File name should be prefixed with HEADER_
                                </div>
                            )}
                            {sizeError && (
                                <div className="w-full text-center text-red-400">
                                    File size too large.
                                </div>
                            )}
                            <div className="flex justify-center">
                                {uploading ? (
                                    <CircularProgress
                                        classNames={{
                                            svg: "w-20 h-20 drop-shadow-md",
                                            value: "text-xl",
                                        }}
                                        showValueLabel={true}
                                        value={uploadProgress}
                                        color="warning"
                                        aria-label="Loading..."
                                    />
                                ) : (
                                    <SegmentTopImageUploadButton
                                        check="SEGHEAD"
                                        format="image"
                                        setValue={props.setValue}
                                        setTopImage={props.setTopImage}
                                        onOpenChange={
                                            props.onOpenChangeTopImage
                                        }
                                    />
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
                            <div className="grid xl:grid-cols-4 gap-5">
                                {availableImages.map(
                                    (image: Images, index: number) => {
                                        if (
                                            index >
                                                currentPage * imagesPerPage -
                                                    (imagesPerPage + 1) &&
                                            index < currentPage * imagesPerPage
                                        ) {
                                            return (
                                                <div
                                                    key={
                                                        image.name + "-" + index
                                                    }
                                                    className="flex cursor-pointer"
                                                    onClick={() => {
                                                        props.setValue(
                                                            "headerImage",
                                                            image.name,
                                                            {
                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );
                                                        props.setTopImage(
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
                                    }
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="rounded-md"
                                color="danger"
                                onPress={() => {
                                    setTopImageNamingError(false);
                                    setSizeError(false);
                                    setNotImageError(false);
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
