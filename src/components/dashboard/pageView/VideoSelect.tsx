"use client";

import { useContext, useEffect, useState } from "react";
import { HeaderStateContext } from "./HeaderStateProvider";
import Image from "next/image";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import SelectVideoModal from "./SelectVideoModal";

export default function VideoSelect(props: {
    formTarget: "video1" | "video2" | "backgroundVideo";
}) {
    const { formTarget } = props;
    const { video1, video2, backgroundVideo } = useContext(HeaderStateContext);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);

    function videoFromTarget() {
        switch (formTarget) {
            case "video1":
                return video1;
            case "video2":
                return video2;
            case "backgroundVideo":
                return backgroundVideo;
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
        }
    }

    const { isOpen: isOpenPreview, onOpenChange: onOpenChangePreview } =
        useDisclosure();
    const { isOpen: isOpenSelect, onOpenChange: onOpenChangeSelect } =
        useDisclosure();

    useEffect(() => {
        if (!isOpenPreview) {
            setTimeout(() => {
                setPreviewVideo(null);
            }, 300);
        }
    }, [isOpenPreview]);

    if (videoFromTarget()) {
        return (
            <div id="video1">
                <div className="text-center">{titleFromTarget()}</div>
                <div
                    onClick={() => {
                        setPreviewVideo(videoFromTarget());
                        onOpenChangePreview();
                    }}
                    className="cursor-pointer m-auto border rounded p-4 flex w-1/3 xl:w-1/2 my-4">
                    <Image
                        height={100}
                        width={100}
                        src={"/images/play.png"}
                        alt="play"
                        className="w-full h-auto m-auto"
                    />
                </div>
                <div className="text-center truncate">
                    {videoFromTarget().split("-")[0].split(".")[0] +
                        "." +
                        videoFromTarget().split(".")[1]}
                </div>
                <div className="text-center mt-2">
                    <button
                        type="button"
                        onClick={() => {
                            onOpenChangeSelect();
                        }}
                        className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                        Change Video
                    </button>
                </div>
                <SelectVideoModal
                    formTarget={formTarget}
                    isOpen={isOpenSelect}
                    onOpenChange={onOpenChangeSelect}
                />
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
            </div>
        );
    } else {
        return (
            <div id="select-video">
                <div className="text-center">{titleFromTarget()}</div>
                <div className="text-center mt-4">None Selected</div>
                <div className="text-center mt-2">
                    <Button
                        type="button"
                        onClick={() => {
                            onOpenChangeSelect();
                        }}
                        className=" bg-orange-600 rounded-md text-white text-md m-auto">
                        Select Video
                    </Button>
                </div>
                <SelectVideoModal
                    formTarget={formTarget}
                    isOpen={isOpenSelect}
                    onOpenChange={onOpenChangeSelect}
                />
            </div>
        );
    }
}
