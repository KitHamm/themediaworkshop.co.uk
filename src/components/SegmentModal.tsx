"use client";

// Library Components
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Chip,
} from "@nextui-org/react";
import Markdown from "react-markdown";

// Next Components
import Image from "next/image";

// Components
import {
    EmblaCarouselCaseStudyInner,
    EmblaCarouselCaseStudyView,
} from "./Embla/EmblaCarousel";

// Types
import { CaseStudy } from "@prisma/client";
import { useState } from "react";

export default function SegmentModal(props: { caseStudy: CaseStudy }) {
    // States for selected video and image to view
    const [caseIndex, setCaseIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState("");

    // Image Preview Modal
    const {
        isOpen: isOpenImage,
        onOpen: onOpenImage,
        onOpenChange: onOpenChangeImage,
    } = useDisclosure();

    // Video Preview Modal
    const {
        isOpen: isOpenVideo,
        onOpen: onOpenVideo,
        onOpenChange: onOpenChangeVideo,
    } = useDisclosure();

    return (
        <div id="content">
            {props.caseStudy.map((casestudy: CaseStudy, caseIndex: number) => {
                return (
                    <div
                        key={casestudy.title + "_" + caseIndex}
                        className={`py-8 ${
                            caseIndex !== 0 ? "border-t border-neutral-600" : ""
                        } `}>
                        <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                            {caseIndex % 2 === 0 ? (
                                <div
                                    id="left"
                                    className="px-5 pb-5 order-first">
                                    <div className="w-full pb-2 mb-2 border-b text-2xl font-bold text-orange-600">
                                        {casestudy.title}
                                    </div>
                                    <div className="mb-2">
                                        {casestudy.dateLocation}
                                    </div>
                                    <div className="w-full text-lg">
                                        <Markdown>{casestudy.copy}</Markdown>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {casestudy.tags.map(
                                            (tag: string, index: number) => {
                                                return (
                                                    <Chip
                                                        key={tag + "-" + index}>
                                                        {tag}
                                                    </Chip>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            <div id="media" className="xl:mt-10">
                                <div
                                    id="images"
                                    className="my-auto carousel-embla">
                                    {casestudy.image.length > 1 ? (
                                        <div
                                            onClick={() => {
                                                setCaseIndex(caseIndex);
                                                onOpenChangeImage();
                                            }}>
                                            <EmblaCarouselCaseStudyInner
                                                slides={casestudy.image}
                                            />
                                        </div>
                                    ) : (
                                        <Image
                                            onClick={() => {
                                                setCaseIndex(caseIndex);
                                                onOpenChangeImage();
                                            }}
                                            width={900}
                                            height={500}
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                casestudy.image
                                            }
                                            alt="Placeholder"
                                            className="w-full h-auto cursor-pointer"
                                        />
                                    )}
                                    {casestudy.video.length > 0 && (
                                        <div className="relative">
                                            <video
                                                playsInline
                                                disablePictureInPicture
                                                id="bg-video"
                                                className="h-auto w-full fade-in mt-2"
                                                autoPlay={false}
                                                muted
                                                loop
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_BASE_VIDEO_URL +
                                                    casestudy.video
                                                }
                                            />
                                            {casestudy.videoThumbnail ? (
                                                <div
                                                    onClick={() => {
                                                        setSelectedVideo(
                                                            casestudy.video
                                                        );
                                                        onOpenChangeVideo();
                                                    }}
                                                    className="absolute z-10 bottom-0 w-full h-full flex cursor-pointer">
                                                    <Image
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                            casestudy.videoThumbnail
                                                        }
                                                        alt="thumbnail"
                                                        width={500}
                                                        height={300}
                                                        className="h-full w-auto m-auto"
                                                    />
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <div
                                                onClick={() => {
                                                    setSelectedVideo(
                                                        casestudy.video
                                                    );
                                                    onOpenChangeVideo();
                                                }}
                                                className="transition-all absolute z-20 bg-black hover:bg-opacity-25 bg-opacity-50 bottom-0 w-full h-full flex cursor-pointer">
                                                <Image
                                                    src={"/images/play.png"}
                                                    alt="play"
                                                    width={500}
                                                    height={300}
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
                                        {casestudy.title}
                                    </div>
                                    <div className="mb-2">
                                        {casestudy.dateLocation}
                                    </div>
                                    <div className="w-full text-lg">
                                        <Markdown>{casestudy.copy}</Markdown>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-5">
                                        {casestudy.tags.map(
                                            (tag: string, index: number) => {
                                                return (
                                                    <Chip
                                                        key={tag + "-" + index}>
                                                        {tag}
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
            })}
            <Modal
                size="4xl"
                placement="center"
                backdrop="blur"
                isOpen={isOpenImage}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeImage}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                {props.caseStudy[caseIndex].image.length > 1 ? (
                                    <EmblaCarouselCaseStudyView
                                        slides={
                                            props.caseStudy[caseIndex].image
                                        }
                                    />
                                ) : (
                                    <Image
                                        width={900}
                                        height={500}
                                        src={
                                            process.env
                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                            props.caseStudy[caseIndex].image
                                        }
                                        alt={props.caseStudy[caseIndex].image}
                                        className="w-full h-auto"
                                    />
                                )}
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
            <Modal
                size="4xl"
                placement="center"
                backdrop="blur"
                isOpen={isOpenVideo}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeVideo}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                <video
                                    playsInline
                                    disablePictureInPicture
                                    id="bg-video"
                                    className="h-auto w-full fade-in mt-2"
                                    autoPlay={true}
                                    controls
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        selectedVideo
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
        </div>
    );
}
