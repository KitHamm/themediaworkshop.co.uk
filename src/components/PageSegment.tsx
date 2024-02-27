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
import Markdown from "react-markdown";
import { useInView } from "react-intersection-observer";

// Embla Carousel Components
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

// React Components
import { useEffect, useState, useRef } from "react";

// Next Components
import Image from "next/image";

// Types
import { Segment } from "@prisma/client";
import Link from "next/link";

export default function PageSegment(props: {
    segment: Segment;
    index: number;
}) {
    // InView declarations
    const { ref, inView } = useInView({
        /* Optional options */
        threshold: 0.1,
    });

    useEffect(() => {
        const el = document.getElementById("fade-" + props.index);
        if (el && inView) {
            if (el.classList.contains("opacity-0")) {
                el.classList.replace(
                    "opacity-0",
                    props.index % 2 === 0 ? "slide-in-right" : "slide-in-left"
                );
            }
        }
    }, [inView]);

    // Parallax element ref
    const headerImageContainer = useRef<HTMLDivElement>(null);
    const headerImage = useRef<HTMLImageElement>(null);
    const copyText = useRef<HTMLDivElement>(null);

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
    const [emblaRef] = useEmblaCarousel(OPTIONS, [Autoplay({ delay: 6000 })]);
    const [emblaRefRTL] = useEmblaCarousel(OPTIONSRTL, [
        Autoplay({ delay: 6000 }),
    ]);

    // Case Study modal declaration
    const {
        isOpen: isOpenCaseStudy,
        onOpen: onOpenCaseStudy,
        onOpenChange: onOpenChangeCaseStudy,
    } = useDisclosure();

    useEffect(() => {
        const anchors: HTMLAnchorElement[] = [];
        if (copyText.current?.children.length! > 0) {
            for (
                let i = 0;
                i < copyText.current?.children[0].children.length!;
                i++
            ) {
                if (copyText.current?.children[0].children[i].tagName === "A")
                    anchors.push(
                        copyText.current?.children[0].children[
                            i
                        ] as HTMLAnchorElement
                    );
            }
        }
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].setAttribute("target", "_blank");
            anchors[i].setAttribute("rel", "noreferrer");
        }
        if (headerImage.current) {
            onScroll();
            headerImage.current.classList.replace("opacity-0", "fade-in");
            window.addEventListener("scroll", onScroll);
        }
    }, []);

    function onScroll() {
        if (headerImageContainer.current && headerImage.current) {
            const containerHeight = headerImageContainer.current.offsetHeight;
            const imageHeight = headerImage.current.offsetHeight;
            setContainerHeight((imageHeight / 8) * 6);
            if (
                headerImageContainer.current.getBoundingClientRect().top <
                    window.innerHeight &&
                headerImageContainer.current.getBoundingClientRect().top >
                    0 - containerHeight
            ) {
                setParallaxValue(
                    0 -
                        mapNumRange(
                            headerImageContainer.current.getBoundingClientRect()
                                .top,
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
                    ref={headerImageContainer}
                    className="relative flex w-full bg-black justify-center overflow-hidden segment-header-image">
                    <Image
                        ref={headerImage}
                        style={{ top: parallaxValue + "px" }}
                        width={2560}
                        height={500}
                        className="opacity-0 absolute w-[200%] h-auto xl:w-full xl:w-full xl:h-auto"
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
            <div className="grid grid-cols-1 xl:grid-cols-2 w-full px-10 xl:px-60 py-10">
                {props.index % 2 === 0 ? (
                    <div
                        id={"fade-" + props.index}
                        className="relative opacity-0 text-center my-auto z-20">
                        <div className="xl:absolute xl:left-0 xl:right-0 xl:-top-10">
                            {props.segment.linkTo !== "NONE" ? (
                                <Link
                                    className="hover:text-orange-600 transition-all uppercase font-bold text-3xl"
                                    href={
                                        "/" + props.segment.linkTo.toLowerCase()
                                    }>
                                    {props.segment.title}
                                </Link>
                            ) : (
                                <div className="uppercase font-bold text-3xl">
                                    {props.segment.title}
                                </div>
                            )}
                        </div>
                        <div ref={ref}>
                            <div
                                ref={copyText}
                                className="copy-text text-justify text-md xl:text-lg xl:mb-0 mt-4 mb-5">
                                <Markdown>{props.segment.copy}</Markdown>
                            </div>
                        </div>

                        {props.segment.casestudy.length > 0 && (
                            <div className="xl:absolute xl:left-0 xl:right-0 xl:-bottom-15">
                                <div className="xl:text-center xl:mt-4">
                                    <button
                                        onClick={onOpenChangeCaseStudy}
                                        className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 xl:mt-2 mb-6 xl:mb-0 px-4 py-2 bg-orange-600">
                                        {props.segment.buttonText
                                            ? props.segment.buttonText
                                            : "Examples"}
                                    </button>
                                </div>
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
                    <div
                        id={"fade-" + props.index}
                        className=" opacity-0 text-center z-20 xl:m-auto mx-auto order-first xl:order-last">
                        <div className="xl:absolute xl:left-0 xl:right-0 xl:-top-10">
                            {props.segment.linkTo !== "NONE" ? (
                                <Link
                                    className="hover:text-orange-600 transition-all uppercase font-bold text-3xl"
                                    href={
                                        "/" + props.segment.linkTo.toLowerCase()
                                    }>
                                    {props.segment.title}
                                </Link>
                            ) : (
                                <div className="uppercase font-bold text-3xl">
                                    {props.segment.title}
                                </div>
                            )}
                        </div>
                        <div
                            ref={ref}
                            className="text-justify text-md xl:text-lg xl:mb-0 mt-4 mb-5">
                            <Markdown>{props.segment.copy}</Markdown>
                        </div>
                        {props.segment.casestudy.length > 0 && (
                            <div className="xl:absolute xl:left-0 xl:right-0 xl:-bottom-15">
                                <div className="text-center xl:mt-4">
                                    <button
                                        onClick={onOpenChangeCaseStudy}
                                        className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 xl:mt-2 mb-6 xl:mb-0 px-4 py-2 bg-orange-600">
                                        {props.segment.buttonText
                                            ? props.segment.buttonText
                                            : "Examples"}
                                    </button>
                                </div>
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
