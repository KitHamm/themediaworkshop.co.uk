"use client";

import { useContext, useState } from "react";
import { MediaStateContext } from "./MediaStateProvider";
import { Videos } from "@prisma/client";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { deleteFile } from "@/lib/clientFunctions";
import { errorResponse } from "@/lib/types";

export default function VideoDisplay() {
    const { selectedVideos, videoPage, videosPerPage } =
        useContext(MediaStateContext);

    const { isOpen: isOpenPreview, onOpenChange: onOpenChangePreview } =
        useDisclosure();
    const {
        isOpen: isOpenDeleteWarning,
        onOpenChange: onOpenChangeDeleteWarning,
    } = useDisclosure();

    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [deleteErrorArray, setDeleteErrorArray] = useState<errorResponse[]>(
        []
    );

    function handleDeleteFile() {
        if (selectedVideo) {
            deleteFile(selectedVideo)
                .then(() => {
                    onOpenChangeDeleteWarning();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    return (
        <div className="grid xl:grid-cols-4 grid-cols-2 gap-4 bg-neutral-800 border-solid border-2 border-neutral-600 p-4 rounded">
            {selectedVideos.map((video: Videos, index: number) => {
                if (
                    index > videoPage * videosPerPage - (videosPerPage + 1) &&
                    index < videoPage * videosPerPage
                ) {
                    return (
                        <Tooltip
                            delay={1000}
                            className="dark"
                            placement="bottom"
                            key={video.name + "-" + index}
                            content={video.name.split("-")[0].split("_")[1]}>
                            <div className="flex flex-col border rounded border-neutral-800">
                                <div
                                    onClick={() => {
                                        setSelectedVideo(video.name);
                                        onOpenChangePreview();
                                    }}
                                    className="cursor-pointer bg-black bg-opacity-25 p-4 h-full flex w-full">
                                    <Image
                                        height={100}
                                        width={100}
                                        src={"/images/play.png"}
                                        alt="play"
                                        className="xl:w-full h-auto m-auto"
                                    />
                                </div>
                                <div className="bg-neutral-800 bg-opacity-25">
                                    <div className="text-center truncate p-2 h-full">
                                        {video.name.split("-")[0].split("_")[1]}
                                    </div>
                                </div>
                            </div>
                        </Tooltip>
                    );
                }
            })}
            {selectedVideo && (
                <>
                    <Modal
                        size="5xl"
                        backdrop="blur"
                        isOpen={isOpenPreview}
                        className="dark"
                        onOpenChange={onOpenChangePreview}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader>
                                        {selectedVideo.split("-")[0] +
                                            "." +
                                            selectedVideo.split(".")[1]}
                                    </ModalHeader>
                                    <ModalBody>
                                        <div>
                                            <video
                                                autoPlay
                                                playsInline
                                                disablePictureInPicture
                                                id="bg-video"
                                                controls={true}
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_CDN +
                                                    "/videos/" +
                                                    selectedVideo
                                                }
                                            />
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            className="rounded-md"
                                            color="danger"
                                            variant="light"
                                            onPress={() => {
                                                onOpenChangeDeleteWarning();
                                                onClose();
                                            }}>
                                            Delete Video
                                        </Button>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            className="transition-all hover:bg-opacity-85 text-sm bg-orange-600 flex items-center px-2 py-1 rounded-md"
                                            href={
                                                process.env.NEXT_PUBLIC_CDN +
                                                "/videos/" +
                                                selectedVideo
                                            }
                                            download>
                                            Download
                                        </a>
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
                    <Modal
                        size="xl"
                        backdrop="blur"
                        isDismissable={false}
                        isOpen={isOpenDeleteWarning}
                        className="dark"
                        onOpenChange={onOpenChangeDeleteWarning}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader>
                                        <div className="w-full flex justify-center">
                                            <div className="font-bold text-2xl text-red-400">
                                                WARNING
                                            </div>
                                        </div>
                                    </ModalHeader>
                                    <ModalBody>
                                        {deleteErrorArray.length > 0 ? (
                                            <>
                                                <div className="w-full text-center">
                                                    <div className="font-bold text-red-400 text-xl">
                                                        This file is being used!
                                                    </div>
                                                </div>

                                                <div className="font-bold text-xl">
                                                    Details:
                                                </div>
                                                {deleteErrorArray.map(
                                                    (
                                                        error: errorResponse,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <div
                                                                className="flex flex-col"
                                                                key={
                                                                    "error-" +
                                                                    index
                                                                }>
                                                                <div>
                                                                    <strong>
                                                                        Used as:{" "}
                                                                    </strong>
                                                                    {error.type}
                                                                </div>
                                                                {error.caseTitle && (
                                                                    <>
                                                                        <div>
                                                                            <strong>
                                                                                Case
                                                                                Study:{" "}
                                                                            </strong>
                                                                            {
                                                                                error.caseTitle
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {error.segmentTitle && (
                                                                    <>
                                                                        <div>
                                                                            <strong>
                                                                                Segment:{" "}
                                                                            </strong>
                                                                            {
                                                                                error.segmentTitle
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )}
                                                                {error.pageTitle && (
                                                                    <>
                                                                        <div>
                                                                            <strong>
                                                                                Page:{" "}
                                                                            </strong>
                                                                            {
                                                                                error.pageTitle
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full">
                                                <div className="text-center">
                                                    Please make sure this media
                                                    is not used on any pages
                                                    before deleting.
                                                </div>
                                            </div>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            className="rounded-md"
                                            onPress={() => {
                                                onClose();
                                                setDeleteErrorArray([]);
                                            }}>
                                            Cancel
                                        </Button>
                                        {deleteErrorArray.length === 0 && (
                                            <Button
                                                color="danger"
                                                variant="light"
                                                className="rounded-md"
                                                onPress={() => {
                                                    handleDeleteFile();
                                                }}>
                                                Delete Media
                                            </Button>
                                        )}
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </div>
    );
}
