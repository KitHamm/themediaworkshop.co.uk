"use client";

import { useContext, useEffect, useState } from "react";
import { HeaderStateContext } from "./HeaderStateProvider";
import { MediaFilesContext } from "./MediaFIlesProvider";
import { Videos } from "@prisma/client";
import { itemOrder, videoSort } from "@/lib/functions";
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
    useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import MediaUploadButton from "@/components/shared/MediaUploadButton";
import { MediaType } from "@/lib/constants";
import { set, UseFormSetValue } from "react-hook-form";
import { CaseStudyFromType } from "@/lib/types";

export default function SelectVideoModal(props: {
    formTarget?: "video1" | "video2" | "backgroundVideo";
    setValueCaseStudy?: UseFormSetValue<CaseStudyFromType>;
    isOpen: boolean;
    onOpenChange: () => void;
    currentVideo?: string;
}) {
    const {
        formTarget,
        isOpen,
        onOpenChange,
        setValueCaseStudy,
        currentVideo,
    } = props;
    const { video1, video2, backgroundVideo, setValue } =
        useContext(HeaderStateContext);

    const { videos } = useContext(MediaFilesContext);

    const { isOpen: isOpenPreview, onOpenChange: onOpenChangePreview } =
        useDisclosure();

    function videoFromTarget() {
        switch (formTarget) {
            case "video1":
                return video1;
            case "video2":
                return video2;
            case "backgroundVideo":
                return backgroundVideo;
            default:
                return currentVideo;
        }
    }

    function titleFromTarget() {
        switch (formTarget) {
            case "video1":
                return "Video 1";
            case "video2":
                return "Video 2";
            case "backgroundVideo":
                return "Background Video";
            default:
                return "Case Study Video";
        }
    }

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [videosPerPage, setVideosPerPage] = useState(8);
    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        setCurrentPage(1);
    }, [videosPerPage]);

    const [availableVideos, setAvailableVideos] = useState<Videos[]>(
        itemOrder(
            videoSort(
                videos,
                formTarget === "backgroundVideo" ? "HEADER" : "VIDEO"
            ),
            sortBy,
            order
        )
    );

    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpenPreview) {
            setTimeout(() => {
                setPreviewVideo(null);
            }, 300);
        }
    }, [isOpenPreview]);

    useEffect(() => {
        setAvailableVideos(
            videoSort(
                videos,
                formTarget === "backgroundVideo" ? "HEADER" : "VIDEO"
            )
        );
    }, [videos]);

    useEffect(() => {
        setAvailableVideos(itemOrder(availableVideos, sortBy, order));
    }, [sortBy, order]);

    function handleSetValue(returnedURL: string) {
        if (formTarget) {
            setValue(formTarget, returnedURL, { shouldDirty: true });
        }
        if (setValueCaseStudy !== undefined) {
            setValueCaseStudy("video", returnedURL, { shouldDirty: true });
        }
    }

    function handleReturnError(error: string) {
        if (error !== "success" && error !== "") {
            setUploadError(error);
        } else {
            setUploadError(null);
        }
    }

    function handleReturnClose() {
        setUploadError(null);
        onOpenChange();
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
                                        mediaType={
                                            formTarget === "backgroundVideo"
                                                ? MediaType.HEADER
                                                : MediaType.VIDEO
                                        }
                                        onOpenChange={handleReturnClose}
                                        returnURL={handleSetValue}
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
                                            videosPerPage.toString(),
                                        ]}
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
                                            availableVideos.length /
                                                videosPerPage
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
                                                    currentPage *
                                                        videosPerPage -
                                                        (videosPerPage + 1) &&
                                                index <
                                                    currentPage * videosPerPage
                                            ) {
                                                return (
                                                    <div
                                                        key={
                                                            video.name +
                                                            "-" +
                                                            index
                                                        }>
                                                        <div
                                                            onClick={() => {
                                                                setPreviewVideo(
                                                                    video.name
                                                                );
                                                                onOpenChangePreview();
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
                                                                    .split(
                                                                        "-"
                                                                    )[0]
                                                                    .split(
                                                                        "_"
                                                                    )[1]
                                                            }
                                                        </div>
                                                        <div className="flex justify-center mt-2">
                                                            <button
                                                                onClick={() => {
                                                                    handleSetValue(
                                                                        video.name
                                                                    );
                                                                    setCurrentPage(
                                                                        1
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
                            <ModalFooter className="mt-4">
                                {videoFromTarget() ? (
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            handleSetValue("");
                                            setCurrentPage(1);
                                            onClose();
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
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {previewVideo && (
                <Modal
                    size="5xl"
                    backdrop="blur"
                    isOpen={isOpenPreview}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangePreview}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold text-3xl">
                                        {previewVideo.split("-")[0] +
                                            "." +
                                            previewVideo.split(".")[1]}
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    <video
                                        autoPlay
                                        playsInline
                                        disablePictureInPicture
                                        id="bg-video"
                                        controls={true}
                                        src={
                                            process.env.NEXT_PUBLIC_CDN +
                                            "/videos/" +
                                            previewVideo
                                        }
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
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
            )}
        </>
    );
}
