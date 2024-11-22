"use client";

import {
    Button,
    CircularProgress,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import PageVideoUploadButton from "../../Uploads/PageVideoUploadButton";
import { DashboardStateContext } from "../../DashboardStateProvider";
import { useContext } from "react";
import { Videos } from "@prisma/client";
import Image from "next/image";

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
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                {props.videos.map(
                                    (video: Videos, index: number) => {
                                        if (
                                            video.name.split("_")[0] ===
                                            props.prefixCheck
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
                                                            video.name.split(
                                                                "-"
                                                            )[0]
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
                            <ModalFooter>
                                {/* getValues("backgroundVideo") */}
                                {props.hasVideoSet ? (
                                    <button
                                        onClick={() => {
                                            props.setValue(
                                                props.modalTarget,
                                                "",
                                                {
                                                    shouldDirty: true,
                                                }
                                            );
                                            onClose();
                                            setNotVideoError(false);
                                            setBackgroundNamingError(false);
                                            setSizeError(false);
                                        }}
                                        className="xl:px-10 px-4 py-2 bg-red-400 rounded-xl">
                                        Remove
                                    </button>
                                ) : (
                                    ""
                                )}
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
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
