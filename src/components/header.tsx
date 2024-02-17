"use client";

// Library Components
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import Markdown from "react-markdown";

// React Components
import Image from "next/image";

type FormTypes = {
    name: string;
    email: string;
    message: string;
};

export default function Header(props: {
    description: String;
    header: string;
    home: boolean;
    showreel: string;
    year: string;
    subTitle: string;
    openContactModal: any;
}) {
    // Contact form states
    const {
        isOpen: isOpenShowreel,
        onOpen: onOpenShowreel,
        onOpenChange: onOpenChangeShowreel,
    } = useDisclosure();
    // Year review modal declaration
    const {
        isOpen: isOpenYear,
        onOpen: onOpenYear,
        onOpenChange: onOpenChangeYear,
    } = useDisclosure();

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
                                        SHOWREEL
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
                                        YEAR REVIEW
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
                        <div className="slide-up min-h-20 min-w-96 px-4 py-4 xl:py-0 text-justify text-md xl:text-lg">
                            <Markdown>{props.description as string}</Markdown>
                        </div>
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
                // closeButton={<div></div>}
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
                // closeButton={<div></div>}
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
