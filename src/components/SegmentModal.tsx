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
                        <div className="grid grid-cols-2 gap-4">
                            {caseIndex % 2 === 0 ? (
                                <div id="left" className="my-auto p-5">
                                    <div className="w-full pb-2 mb-4 border-b text-2xl font-bold text-orange-400">
                                        {casestudy.title}
                                    </div>
                                    <div className="w-full text-lg">
                                        {casestudy.copy}
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
                            <div id="media">
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
                                        <video
                                            onClick={() => {
                                                setSelectedVideo(
                                                    casestudy.video
                                                );
                                                onOpenChangeVideo();
                                            }}
                                            id="bg-video"
                                            className="h-auto w-full fade-in mt-2 cursor-pointer"
                                            autoPlay={true}
                                            muted
                                            loop
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_BASE_VIDEO_URL +
                                                casestudy.video
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {caseIndex % 2 !== 0 ? (
                                <div id="right" className="my-auto p-5">
                                    <div className="w-full pb-2 mb-4 border-b text-2xl font-bold text-orange-400">
                                        {casestudy.title}
                                    </div>
                                    <div className="w-full text-lg">
                                        {casestudy.copy}
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
