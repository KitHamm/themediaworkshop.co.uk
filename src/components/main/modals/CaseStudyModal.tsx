"use client";

import { EmblaCarouselCaseStudyInner } from "@/Embla/EmblaCarousel";
import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { CaseStudy } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import ViewCSImagesModal from "./ViewCSImagesModal";
import ViewCSVideoModal from "./ViewCSVideoModal";

export default function CaseStudyModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    segmentTitle: string | null;
    caseStudies: CaseStudy[];
}) {
    const { isOpen, onOpenChange, segmentTitle, caseStudies } = props;

    // preview modal declarations
    const { isOpen: isOpenImage, onOpenChange: onOpenChangeImage } =
        useDisclosure();
    const { isOpen: isOpenVideo, onOpenChange: onOpenChangeVideo } =
        useDisclosure();

    // set images and video for preview modal
    const [imagesToView, setImagesToView] = useState<string[]>([]);
    const [videoToView, setVideoToView] = useState<string | null>(null);

    // copy text els ref
    const copyText = useRef<HTMLDivElement[]>([]);

    // handle copy text add target blank
    useEffect(() => {
        if (copyText.current.length > 0) {
            for (let i = 0; i < copyText.current.length; i++) {
                const anchors: HTMLAnchorElement[] = [];
                for (
                    let j = 0;
                    j < copyText.current[i].children[0].children.length;
                    j++
                ) {
                    if (
                        copyText.current[i].children[0].children[j].tagName ===
                        "A"
                    )
                        anchors.push(
                            copyText.current[i].children[0].children[
                                j
                            ] as HTMLAnchorElement
                        );
                }
                for (let k = 0; k < anchors.length; k++) {
                    anchors[k].setAttribute("target", "_blank");
                    anchors[k].setAttribute("rel", "noreferrer");
                }
            }
        }
    }, []);

    // handle render of modals
    useEffect(() => {
        if (!isOpenImage) {
            setTimeout(() => {
                setImagesToView([]);
            }, 300);
        }
    }, [isOpenImage]);

    useEffect(() => {
        if (!isOpenVideo) {
            setTimeout(() => {
                setVideoToView(null);
            }, 300);
        }
    }, [isOpenVideo]);

    return (
        <>
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="text-3xl w-full text-center">
                                    {segmentTitle}
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {caseStudies.map(
                                    (
                                        casestudy: CaseStudy,
                                        caseIndex: number
                                    ) => {
                                        return (
                                            <div
                                                key={
                                                    casestudy.title +
                                                    "_" +
                                                    caseIndex
                                                }
                                                className={`py-8 ${
                                                    caseIndex !== 0
                                                        ? "border-t border-neutral-600"
                                                        : ""
                                                } `}>
                                                <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                                                    {caseIndex % 2 === 0 ? (
                                                        <div
                                                            id="left"
                                                            className="px-5 pb-5 order-first">
                                                            <div className="w-full pb-2 mb-2 border-b text-2xl font-bold text-orange-600">
                                                                {
                                                                    casestudy.title
                                                                }
                                                            </div>
                                                            <div className="mb-2">
                                                                {
                                                                    casestudy.dateLocation
                                                                }
                                                            </div>
                                                            <div
                                                                ref={(
                                                                    el: HTMLDivElement
                                                                ) => {
                                                                    copyText.current![
                                                                        caseIndex
                                                                    ] = el;
                                                                }}
                                                                className="copy-text w-full text-lg">
                                                                <Markdown>
                                                                    {
                                                                        casestudy.copy
                                                                    }
                                                                </Markdown>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-5">
                                                                {casestudy.tags.map(
                                                                    (
                                                                        tag: string,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <Chip
                                                                                key={
                                                                                    tag +
                                                                                    "-" +
                                                                                    index
                                                                                }>
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </Chip>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                    <div
                                                        id="media"
                                                        className="xl:mt-10">
                                                        <div
                                                            id="images"
                                                            className="my-auto carousel-embla">
                                                            {casestudy.image
                                                                .length > 0 ? (
                                                                casestudy.image
                                                                    .length >
                                                                1 ? (
                                                                    <div
                                                                        onClick={() => {
                                                                            setImagesToView(
                                                                                casestudy.image
                                                                            );
                                                                            onOpenChangeImage();
                                                                        }}>
                                                                        <EmblaCarouselCaseStudyInner
                                                                            slides={
                                                                                casestudy.image
                                                                            }
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <Image
                                                                        onClick={() => {
                                                                            setImagesToView(
                                                                                casestudy.image
                                                                            );
                                                                            onOpenChangeImage();
                                                                        }}
                                                                        width={
                                                                            900
                                                                        }
                                                                        height={
                                                                            500
                                                                        }
                                                                        src={
                                                                            process
                                                                                .env
                                                                                .NEXT_PUBLIC_BASE_IMAGE_URL! +
                                                                            casestudy
                                                                                .image[0]
                                                                        }
                                                                        alt={
                                                                            casestudy
                                                                                .image[0]
                                                                        }
                                                                        className="w-full h-auto cursor-pointer"
                                                                    />
                                                                )
                                                            ) : (
                                                                ""
                                                            )}
                                                            {casestudy.video!
                                                                .length > 0 && (
                                                                <div className="relative">
                                                                    <video
                                                                        playsInline
                                                                        disablePictureInPicture
                                                                        id="bg-video"
                                                                        className="h-auto w-full fade-in mt-2"
                                                                        autoPlay={
                                                                            false
                                                                        }
                                                                        muted
                                                                        loop
                                                                        src={
                                                                            process
                                                                                .env
                                                                                .NEXT_PUBLIC_BASE_VIDEO_URL! +
                                                                            casestudy.video
                                                                        }
                                                                    />
                                                                    {casestudy.videoThumbnail ? (
                                                                        <div
                                                                            onClick={() => {
                                                                                setVideoToView(
                                                                                    casestudy.video
                                                                                );
                                                                                onOpenChangeVideo();
                                                                            }}
                                                                            className="absolute z-10 bottom-0 w-full h-full flex cursor-pointer">
                                                                            <Image
                                                                                src={
                                                                                    process
                                                                                        .env
                                                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                                    casestudy.videoThumbnail
                                                                                }
                                                                                alt="thumbnail"
                                                                                width={
                                                                                    500
                                                                                }
                                                                                height={
                                                                                    300
                                                                                }
                                                                                className="h-full w-auto m-auto"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    <div
                                                                        onClick={() => {
                                                                            setVideoToView(
                                                                                casestudy.video
                                                                            );
                                                                            onOpenChangeVideo();
                                                                        }}
                                                                        className="transition-all absolute z-20 bg-black hover:bg-opacity-25 bg-opacity-50 bottom-0 w-full h-full flex cursor-pointer">
                                                                        <Image
                                                                            src={
                                                                                "/images/play.png"
                                                                            }
                                                                            alt="play"
                                                                            width={
                                                                                500
                                                                            }
                                                                            height={
                                                                                300
                                                                            }
                                                                            className="transition-all h-1/2 w-auto m-auto hover:opacity-100 opacity-85"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {caseIndex % 2 !== 0 ? (
                                                        <div
                                                            id="right"
                                                            className="px-5 pb-5 order-first xl:order-last">
                                                            <div className="w-full pb-2 mb-2 border-b text-2xl font-bold text-orange-600">
                                                                {
                                                                    casestudy.title
                                                                }
                                                            </div>
                                                            <div className="mb-2">
                                                                {
                                                                    casestudy.dateLocation
                                                                }
                                                            </div>
                                                            <div
                                                                ref={(
                                                                    el: HTMLDivElement
                                                                ) => {
                                                                    copyText.current![
                                                                        caseIndex
                                                                    ] = el;
                                                                }}
                                                                className="copy-text w-full text-lg">
                                                                <Markdown>
                                                                    {
                                                                        casestudy.copy
                                                                    }
                                                                </Markdown>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 mt-5">
                                                                {casestudy.tags.map(
                                                                    (
                                                                        tag: string,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <Chip
                                                                                key={
                                                                                    tag +
                                                                                    "-" +
                                                                                    index
                                                                                }>
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </Chip>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    className="rounded-md"
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
            {imagesToView.length > 0 && (
                <ViewCSImagesModal
                    isOpen={isOpenImage}
                    onOpenChange={onOpenChangeImage}
                    images={imagesToView}
                />
            )}
            {videoToView && (
                <ViewCSVideoModal
                    isOpen={isOpenVideo}
                    onOpenChange={onOpenChangeVideo}
                    videoURL={videoToView}
                />
            )}
        </>
    );
}
