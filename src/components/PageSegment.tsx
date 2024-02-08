"use client";

// Components
import SegmentModal from "./SegmentModal";

// Library Components
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

// Embla Carousel Components
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";

// Types
import { Segment } from "@prisma/client";

export default function PageSegment(props: {
    segment: Segment;
    index: number;
}) {
    //  Parallax States
    const [parallaxValue, setParallaxValue] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    // Carousel declarations
    const OPTIONS: EmblaOptionsType = { align: "start", loop: true };
    const OPTIONSRTL: EmblaOptionsType = {
        align: "start",
        direction: "rtl",
        loop: true,
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS, [
        Autoplay({ delay: 6000 }),
    ]);
    const [emblaRefRTL, emblaApiRTL] = useEmblaCarousel(OPTIONSRTL, [
        Autoplay({ delay: 6000 }),
    ]);

    // Case Study modal declaration
    const {
        isOpen: isOpenCaseStudy,
        onOpen: onOpenCaseStudy,
        onOpenChange: onOpenChangeCaseStudy,
    } = useDisclosure();

    useEffect(() => {
        const headerImage = document.getElementById(
            "segment-header-image-" + props.index
        ) as HTMLElement;
        if (headerImage) {
            onScroll();
            headerImage.classList.replace("opacity-0", "fade-in");
            window.addEventListener("scroll", onScroll);
        }
    }, []);

    function onScroll() {
        const headerImageContainer = document.getElementById(
            "segment-header-image-container-" + props.index
        ) as HTMLElement;
        const headerImage = document.getElementById(
            "segment-header-image-" + props.index
        ) as HTMLElement;
        if (headerImageContainer && headerImage) {
            const containerHeight = headerImageContainer.offsetHeight;
            const imageHeight = headerImage.offsetHeight;
            setContainerHeight((imageHeight / 5) * 4);
            if (
                headerImageContainer.getBoundingClientRect().top <
                    window.innerHeight &&
                headerImageContainer.getBoundingClientRect().top >
                    0 - containerHeight
            ) {
                setParallaxValue(
                    0 -
                        mapNumRange(
                            headerImageContainer.getBoundingClientRect().top,
                            window.innerHeight,
                            0,
                            imageHeight - containerHeight,
                            0
                        )
                );
            }
        }
    }

    const mapNumRange = (
        num: number,
        inMin: number,
        inMax: number,
        outMin: number,
        outMax: number
    ) => ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

    return (
        <>
            {/* If section header image, display image */}
            {props.segment.headerimage ? (
                <div
                    style={{ height: containerHeight + "px" }}
                    id={"segment-header-image-container-" + props.index}
                    className="relative flex w-full bg-black  overflow-hidden segment-header-image">
                    <Image
                        id={"segment-header-image-" + props.index}
                        style={{ top: parallaxValue + "px" }}
                        width={2560}
                        height={500}
                        className="opacity-0 absolute h-auto w-full xl:w-full xl:h-auto"
                        alt={props.segment.headerimage}
                        src={
                            process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                            props.segment.headerimage
                        }
                    />
                </div>
            ) : (
                ""
            )}
            <div className="xl:grid grid-cols-1 xl:grid-cols-2 w-full px-10 xl:px-60 py-10">
                {props.index % 2 === 0 ? (
                    <div className="text-center my-auto z-20">
                        <div className="uppercase font-bold text-3xl mb-4">
                            {props.segment.title}
                        </div>
                        <div className="text-justify text-md xl:text-lg xl:mb-0 mb-10">
                            {props.segment.copy}
                        </div>
                        {props.segment.casestudy.length > 0 && (
                            <div className="text-left">
                                <button
                                    onClick={onOpenChangeCaseStudy}
                                    className="mt-2 px-4 py-2 rounded bg-orange-400">
                                    Examples
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )}
                <div className="text-center">
                    <div
                        className={`${
                            props.index % 2 === 0
                                ? "ms-0 xl:-ms-24"
                                : "ms-0 xl:-me-24"
                        }  relative`}>
                        {props.segment.image.length > 1 ? (
                            <div
                                className="embla"
                                // dir="rtl"
                                dir={props.index % 2 === 0 ? "ltr" : "rtl"}>
                                <div
                                    className="embla__viewport"
                                    ref={
                                        props.index % 2 === 0
                                            ? emblaRef
                                            : emblaRefRTL
                                    }>
                                    <div className="embla__container">
                                        {props.segment.image.map(
                                            (image: string, index: number) => (
                                                <div
                                                    className="embla__slide w-full h-auto"
                                                    key={index}>
                                                    <Image
                                                        width={900}
                                                        height={500}
                                                        className="embla__slide__img"
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                            image
                                                        }
                                                        alt={image}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Image
                                width={900}
                                height={500}
                                src={
                                    process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                    props.segment.image[0]
                                }
                                alt="Placeholder"
                                className="w-full h-auto"
                            />
                        )}

                        <div
                            className={
                                props.index % 2 === 0
                                    ? "gradient-left"
                                    : "gradient-right"
                            }
                        />
                    </div>
                </div>
                {props.index % 2 !== 0 ? (
                    <div className="text-center z-20 m-auto">
                        <div className="uppercase font-bold mt-10 xl:mt-0 text-3xl mb-4">
                            {props.segment.title}
                        </div>
                        <div className="text-justify text-lg">
                            {props.segment.copy}
                        </div>
                        {props.segment.casestudy.length > 0 && (
                            <div className="text-end">
                                <button
                                    onClick={onOpenChangeCaseStudy}
                                    className="px-4 py-2 rounded bg-orange-400">
                                    Examples
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    ""
                )}
            </div>
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenCaseStudy}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeCaseStudy}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="text-3xl w-full text-center">
                                    {props.segment.title}
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <SegmentModal
                                    caseStudy={props.segment.casestudy}
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
        </>
    );
}
