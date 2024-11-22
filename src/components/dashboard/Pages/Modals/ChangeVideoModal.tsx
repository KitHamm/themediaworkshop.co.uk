"use client";

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
import PageVideoUploadButton from "../../Uploads/PageVideoUploadButton";
import { DashboardStateContext } from "../../DashboardStateProvider";
import { useContext, useEffect, useState } from "react";
import { Videos } from "@prisma/client";
import Image from "next/image";
import { itemOrder } from "@/lib/functions";

export default function ChangeVideoModal(props: {
    videos: Videos[];
    isOpenSelectVideo: boolean;
    onOpenChangeSelectVideo: any;
    onOpenChangePreviewVideo: any;
    setValue: any;
    hasVideoSet: boolean;
    modalTarget: string;
    modalTitle: string;
    prefixCheck: string;
}) {
    const {
        notVideoError,
        backgroundNamingError,
        sizeError,
        uploadProgress,
        uploading,
        setNotVideoError,
        setBackgroundNamingError,
        setSizeError,
        setPreviewVideo,
    } = useContext(DashboardStateContext);

    const [availableVideos, setAvailableVideos] = useState<Videos[]>(
        props.videos.filter(
            (video) => video.name.split("_")[0] === props.prefixCheck
        )
    );

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [videosPerPage, setVideosPerPage] = useState(8);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        setCurrentPage(1);
    }, [videosPerPage]);

    useEffect(() => {
        setAvailableVideos(
            props.videos.filter(
                (video) => video.name.split("_")[0] === props.prefixCheck
            )
        );
    }, [props.videos]);

    useEffect(() => {
        setAvailableVideos(itemOrder(availableVideos, sortBy, order));
    }, [sortBy, order]);

    return (
        <Modal
            hideCloseButton
            size="5xl"
            backdrop="blur"
            isOpen={props.isOpenSelectVideo}
            className="dark"
            scrollBehavior="inside"
            isDismissable={false}
            onOpenChange={props.onOpenChangeSelectVideo}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <div className="w-full text-center font-bold text-3xl">
                                {props.modalTitle}
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <div className="w-full text-center">
                                Max size: 100MB
                            </div>
                            {notVideoError && (
                                <div className="w-full text-center text-red-400">
                                    Please Upload file in video format.
                                </div>
                            )}
                            {backgroundNamingError && (
                                <div className="w-full text-center text-red-400">
                                    File name should be prefixed with HEADER_
                                </div>
                            )}
                            {sizeError && (
                                <div className="w-full text-center text-red-400">
                                    File size too large.
                                </div>
                            )}
                            <div className="flex justify-evenly w-full">
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
                                    <div className="file-input shadow-xl">
                                        <PageVideoUploadButton
                                            check={props.prefixCheck}
                                            format="video"
                                            target={props.modalTarget}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-evenly gap-12 mt-4">
                                <Select
                                    className="dark ms-auto me-auto xl:me-0"
                                    classNames={{
                                        popoverContent: "bg-neutral-600",
                                    }}
                                    variant="bordered"
                                    selectedKeys={[videosPerPage.toString()]}
                                    labelPlacement="outside"
                                    label={"Videos Per Page"}
                                    onChange={(e) =>
                                        setVideosPerPage(
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
                            <div className="flex justify-center grow">
                                <Pagination
                                    className="dark mt-auto"
                                    classNames={{
                                        cursor: "bg-orange-600",
                                    }}
                                    showControls
                                    total={Math.ceil(
                                        availableVideos.length / videosPerPage
                                    )}
                                    page={currentPage}
                                    onChange={setCurrentPage}
                                />
                            </div>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                {availableVideos.map(
                                    (video: Videos, index: number) => {
                                        if (
                                            index >
                                                currentPage * videosPerPage -
                                                    (videosPerPage + 1) &&
                                            index < currentPage * videosPerPage
                                        ) {
                                            return (
                                                <div
                                                    key={
                                                        video.name + "-" + index
                                                    }>
                                                    <div
                                                        onClick={() => {
                                                            setPreviewVideo(
                                                                video.name
                                                            );
                                                            props.onOpenChangePreviewVideo();
                                                        }}
                                                        className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4">
                                                        <Image
                                                            height={100}
                                                            width={100}
                                                            src={
                                                                "/images/play.png"
                                                            }
                                                            alt="play"
                                                            className="w-full h-auto m-auto"
                                                        />
                                                    </div>
                                                    <div className="text-center truncate">
                                                        {
                                                            video.name
                                                                .split("-")[0]
                                                                .split("_")[1]
                                                        }
                                                    </div>
                                                    <div className="flex justify-center mt-2">
                                                        <button
                                                            onClick={() => {
                                                                props.setValue(
                                                                    props.modalTarget,
                                                                    video.name,
                                                                    {
                                                                        shouldDirty:
                                                                            true,
                                                                    }
                                                                );
                                                                onClose();
                                                            }}
                                                            className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded">
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }
                                )}
                            </div>
                        </ModalBody>
                        {!uploading && (
                            <ModalFooter className="mt-4">
                                {props.hasVideoSet ? (
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            props.setValue(
                                                props.modalTarget,
                                                "",
                                                {
                                                    shouldDirty: true,
                                                }
                                            );
                                            setCurrentPage(1);
                                            onClose();
                                            setNotVideoError(false);
                                            setBackgroundNamingError(false);
                                            setSizeError(false);
                                        }}
                                        className="xl:px-10 px-4 py-2 rounded-md">
                                        Remove Video
                                    </Button>
                                ) : (
                                    ""
                                )}
                                <Button
                                    className="rounded-md bg-orange-600"
                                    onPress={() => {
                                        setCurrentPage(1);
                                        onClose();
                                        setNotVideoError(false);
                                        setBackgroundNamingError(false);
                                        setSizeError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        )}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
