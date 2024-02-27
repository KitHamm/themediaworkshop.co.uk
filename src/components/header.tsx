"use client";

// Library Components
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import Markdown from "react-markdown";

// Next Components
import Image from "next/image";

// React Components
import { useRef, useEffect } from "react";

export default function Header(props: {
    description: String;
    header: string;
    home: boolean;
    showreel: string;
    year: string;
    subTitle: string;
    openContactModal: any;
    videoOneButtonText: string;
    videoTwoButtonText: string;
}) {
    const chevron = useRef<HTMLDivElement>(null);
    const copyText = useRef<HTMLDivElement>(null);
    // Contact form states
    const { isOpen: isOpenShowreel, onOpenChange: onOpenChangeShowreel } =
        useDisclosure();
    // Year review modal declaration
    const { isOpen: isOpenYear, onOpenChange: onOpenChangeYear } =
        useDisclosure();

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
        window.addEventListener("scroll", onScroll);
        setTimeout(() => {
            if (document.body.getBoundingClientRect().top === 0) {
                chevron.current?.classList.replace("opacity-0", "opacity-100");
            }
        }, 10000);
    }, []);

    function onScroll() {
        chevron.current?.classList.replace("opacity-100", "opacity-0");
    }

    return (
        <>
            <div className="bg-black bg-opacity-30 xl:bg-opacity-0 flex absolute top-0 left-0 z-20 xl:grid xl:grid-cols-2 h-full w-full">
                <div className="m-auto xl:m-0 flex w-full xl:w-auto justify-center">
                    <div className="m-auto text-center w-full xl:w-2/3">
                        <div className="text-2xl xl:text-md uppercase">
                            {props.subTitle}
                        </div>
                        {props.home ? (
                            <>
                                <h1 className="hidden">{props.header}</h1>
                                <Image
                                    src={"/images/tmw-logo.png"}
                                    alt="TMW Logo"
                                    priority
                                    id="title-logo"
                                    height={75}
                                    width={720}
                                    className="w-11/12 xl:w-3/4 h-auto mx-auto mt-2"
                                />
                            </>
                        ) : (
                            <h1 className="font-bold text-4xl uppercase">
                                {props.header}
                            </h1>
                        )}

                        <div className="block grid xl:grid-cols-3 xl:flex xl:justify-evenly grid-cols-1 gap-4 xl:gap-2 xl:px-10 my-10 xl:my-4">
                            {props.showreel !== null &&
                            props.showreel !== undefined &&
                            props.showreel !== "" ? (
                                <div className="">
                                    <button
                                        onClick={onOpenChangeShowreel}
                                        className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 font-bold bg-orange-600 max-w-52 text-sm w-full xl:w-auto py-2 xl:px-8 xl:py-3">
                                        {props.videoOneButtonText !== ""
                                            ? props.videoOneButtonText
                                            : "SHOWREEL"}
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                            {props.year !== null &&
                            props.year !== undefined &&
                            props.year !== "" ? (
                                <div className="my-auto">
                                    <button
                                        onClick={onOpenChangeYear}
                                        className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 font-bold bg-orange-600 max-w-52 w-full text-sm xl:w-auto py-2 xl:px-8 xl:py-3">
                                        {props.videoTwoButtonText !== ""
                                            ? props.videoTwoButtonText
                                            : "YEAR REVIEW"}
                                    </button>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="">
                                <button
                                    onClick={() => props.openContactModal()}
                                    className="transition-all hover:bg-opacity-0 hover:text-white border border-white bg-opacity-90 font-bold bg-white max-w-52 w-full xl:w-auto text-sm py-2 xl:px-8 xl:py-3 text-black">
                                    CONTACT
                                </button>
                            </div>
                        </div>
                        <div
                            ref={copyText}
                            className="copy-text slide-up min-h-20 xl:min-w-96 px-4 py-4 xl:py-0 text-justify text-md xl:text-lg">
                            <Markdown>{props.description as string}</Markdown>
                        </div>
                    </div>
                </div>
                <div
                    ref={chevron}
                    className="transition-opacity ease-in-out opacity-0 w-full absolute left-0 right-0 text-center bottom-40 xl:bottom-10">
                    <div className="flex flex-col gap-4">
                        <i
                            aria-hidden
                            className="chevron fa-solid fa-chevron-down fa-xl"
                        />
                        <i
                            aria-hidden
                            className="chevron fa-solid fa-chevron-down fa-xl"
                        />
                        <i
                            aria-hidden
                            className="chevron fa-solid fa-chevron-down fa-xl"
                        />
                    </div>
                </div>
            </div>
            {/* Showreel modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenShowreel}
                className="dark transition-all"
                placement="center"
                onOpenChange={onOpenChangeShowreel}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            {props.showreel !== null &&
                            props.showreel !== undefined &&
                            props.showreel !== "" ? (
                                <video
                                    playsInline
                                    disablePictureInPicture
                                    className="-z-10"
                                    autoPlay={true}
                                    autoFocus={false}
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        props.showreel
                                    }
                                />
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Year in review modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenYear}
                className="dark transition-all"
                placement="center"
                onOpenChange={onOpenChangeYear}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            {props.showreel !== null &&
                            props.showreel !== undefined &&
                            props.showreel !== "" ? (
                                <video
                                    playsInline
                                    disablePictureInPicture
                                    className="-z-10"
                                    autoPlay={true}
                                    autoFocus={false}
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        props.year
                                    }
                                />
                            ) : (
                                ""
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
