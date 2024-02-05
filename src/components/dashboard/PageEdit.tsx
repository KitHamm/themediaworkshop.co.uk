"use client";

import { Page, Segment, Videos } from "@prisma/client";
import { useEffect, useState } from "react";
import EditSegment from "./Segment";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
} from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import NewSegment from "./NewSegment";
import Image from "next/image";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
    bgVideos: Videos[];
}) {
    const [description, setDescription] = useState(
        props.data.description ? props.data.description : ""
    );
    const [header, setHeader] = useState(
        props.data.header ? props.data.header : ""
    );
    const [video, setVideo] = useState(props.data.video);
    const [uploading, setUploading] = useState(false);
    const [showreel, setShowreel] = useState(props.data.showreel);
    const [changes, setChanges] = useState(false);
    const [notVideoError, setNotVideoError] = useState(false);
    const [videos, setVideos] = useState<Videos[]>([]);
    const [previewVideo, setPreviewVideo] = useState("");
    const {
        isOpen: isOpenAddSegment,
        onOpen: onOpenAddSegment,
        onOpenChange: onOpenChangeAddSegment,
    } = useDisclosure();
    const {
        isOpen: isOpenVideoModal,
        onOpen: onOpenVideoModal,
        onOpenChange: onOpenChangeVideoModal,
    } = useDisclosure();

    const {
        isOpen: isOpenShowreelModal,
        onOpen: onOpenShowreelModal,
        onOpenChange: onOpenChangeShowreelModal,
    } = useDisclosure();
    const {
        isOpen: isOpenSelectVideo,
        onOpen: onOpenSelectVideo,
        onOpenChange: onOpenChangeSelectVideo,
    } = useDisclosure();

    const {
        isOpen: isOpenSelectShowreel,
        onOpen: onOpenSelectShowreel,
        onOpenChange: onOpenChangeSelectShowreel,
    } = useDisclosure();
    const {
        isOpen: isOpenPreviewVideo,
        onOpen: onOpenPreviewVideo,
        onOpenChange: onOpenChangePreviewVideo,
    } = useDisclosure();

    useEffect(() => {
        if (
            description !== props.data.description ||
            header !== props.data.header ||
            video !== props.data.video ||
            showreel !== props.data.showreel
        ) {
            setChanges(true);
        } else {
            setChanges(false);
        }
    }, [
        description,
        header,
        video,
        showreel,
        props.data.description,
        props.data.header,
        props.data.video,
        props.data.showreel,
    ]);

    async function handleUpload(file: File) {
        if (file.type.split("/")[0] !== "video") {
            setNotVideoError(true);
            console.log("Not Video");
            return;
        } else {
            const formData = new FormData();

            formData.append("file", file);

            const response = await fetch("/api/uploadvideo" as string, {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        setUploading(false);
                        // clearFileInput();
                        getVideos();
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    async function getVideos() {
        props.revalidateDashboard("/");
        fetch("/api/videos", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setVideos(json))
            .catch((err) => console.log(err));
    }

    function handleUpdate() {
        const json = {
            description: description,
            header: header,
            video: video,
            showreel: showreel,
        };
        updatePage(json);
    }

    async function updatePage(json: any) {
        const response = await fetch("/api/updatepage", {
            method: "POST",
            body: JSON.stringify({
                id: props.data.id as number,
                data: json,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    if (props.data.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.data.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in mb-10`}>
            <div className="my-10 border-b py-4 flex justify-between">
                <div className="text-3xl font-bold capitalize">
                    {props.data.title}
                </div>
                {changes ? (
                    <div className="fade-in my-auto font-bold text-red-400">
                        There are unsaved Changes
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div className="">
                <div id="top" className="xl:grid xl:grid-cols-2 xl:gap-10">
                    <div id="left-column">
                        <div className="border-b pb-2">Page Videos</div>
                        <div className="xl:grid xl:grid-cols-2 xl:gap-10 min-h-20">
                            <div>
                                {video ? (
                                    <>
                                        <div
                                            onClick={() => {
                                                onOpenChangeVideoModal();
                                            }}
                                            className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4">
                                            <Image
                                                height={100}
                                                width={100}
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                    "play.png"
                                                }
                                                alt="play"
                                                className="w-full h-auto m-auto"
                                            />
                                        </div>
                                        <div className="text-center">
                                            {video}
                                        </div>
                                        <div className="flex justify-center mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectVideo();
                                                    getVideos();
                                                }}
                                                className="px-10 py-2 bg-orange-400 rounded m-auto">
                                                Change
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mt-4">
                                            None Selected
                                        </div>
                                        <div className="flex justify-center h-full">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectVideo();
                                                    getVideos();
                                                }}
                                                className="px-10 py-2 bg-orange-400 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {showreel ? (
                                    <>
                                        <div
                                            onClick={() => {
                                                onOpenChangeShowreelModal();
                                            }}
                                            className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4">
                                            <Image
                                                height={100}
                                                width={100}
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                    "play.png"
                                                }
                                                alt="play"
                                                className="w-full h-auto m-auto"
                                            />
                                        </div>
                                        <div className="text-center">
                                            {showreel}
                                        </div>
                                        <div className="flex justify-center mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectShowreel();
                                                    getVideos();
                                                }}
                                                className="px-10 py-2 bg-orange-400 rounded m-auto">
                                                Change
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center mt-4">
                                            None Selected
                                        </div>
                                        <div className="flex justify-center h-full">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectShowreel();
                                                    getVideos();
                                                }}
                                                className="px-10 py-2 bg-orange-400 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 mb-10">
                            <div className="border-b pb-2 mb-2">Header</div>
                            <input
                                placeholder="Title"
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                id={"header-" + props.data.title}
                                name={"header-" + props.data.title}
                                type="text"
                                className="text-black"
                            />
                        </div>
                    </div>
                    <div id="right-colum">
                        <div>
                            <div className="border-b pb-2 mb-2">
                                Description
                            </div>
                            <textarea
                                value={description ? description : ""}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                name={"description-" + props.data.title}
                                id={"description-" + props.data.title}
                                className="text-black h-52"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdate();
                                    }}
                                    disabled={!changes}
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-400 bg-orange-400 disabled:text-black rounded-md px-4 py-2">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="segments">
                    <div className="flex justify-between border-b pb-2 mt-10 mb-2">
                        <div className="font-bold text-2xl">Segments</div>
                        <button
                            onClick={onOpenAddSegment}
                            className="px-4 py-2 bg-orange-400 rounded">
                            Add Segment
                        </button>
                    </div>
                    <Accordion variant="splitted">
                        {props.data.segment.map(
                            (segment: Segment, index: number) => {
                                return (
                                    <AccordionItem
                                        className="dark"
                                        key={index}
                                        aria-label={segment.title}
                                        title={
                                            segment.title
                                                ? segment.title
                                                : "Untitled Segment"
                                        }>
                                        <div key={segment.title + "-" + index}>
                                            <EditSegment
                                                revalidateDashboard={
                                                    props.revalidateDashboard
                                                }
                                                title={props.data.title}
                                                segment={segment}
                                                index={index}
                                            />
                                        </div>
                                    </AccordionItem>
                                );
                            }
                        )}
                    </Accordion>
                </div>
            </div>
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenAddSegment}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeAddSegment}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Add Segment
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <NewSegment
                                    revalidateDashboard={
                                        props.revalidateDashboard
                                    }
                                    title={props.data.title}
                                    pageID={props.data.id}
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
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenPreviewVideo}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangePreviewVideo}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                <video
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
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
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenVideoModal}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeVideoModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Background video
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <video
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        video
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
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenShowreelModal}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeShowreelModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Showreel
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <video
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        video
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
            {/* Change BG Video */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenSelectVideo}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeSelectVideo}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Background Video
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {notVideoError ? (
                                    <div className="w-full text-center text-red-400">
                                        Please Upload file in video format.
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="flex justify-evenly w-full">
                                    <div className="file-input shadow-xl">
                                        <input
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setUploading(true);
                                                    handleUpload(
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                            id={"upload-showreel"}
                                            type="file"
                                            className="inputFile"
                                        />
                                        <label htmlFor={"upload-showreel"}>
                                            Upload New
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {videos.map(
                                        (video: Videos, index: number) => {
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
                                                            onOpenChangePreviewVideo();
                                                        }}
                                                        className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4">
                                                        <Image
                                                            height={100}
                                                            width={100}
                                                            src={
                                                                process.env
                                                                    .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                "play.png"
                                                            }
                                                            alt="play"
                                                            className="w-full h-auto m-auto"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        {video.name}
                                                    </div>
                                                    <div className="flex justify-center mt-2">
                                                        <button
                                                            onClick={() => {
                                                                setVideo(
                                                                    video.name
                                                                );
                                                                onClose();
                                                            }}
                                                            className="px-10 py-2 bg-orange-400 rounded">
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {video ? (
                                    <button
                                        onClick={() => {
                                            setVideo("");
                                            onClose();
                                        }}
                                        className="px-10 py-2 bg-red-400 rounded-xl">
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
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenSelectShowreel}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeSelectShowreel}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Showreel
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {notVideoError ? (
                                    <div className="w-full text-center text-red-400">
                                        Please Upload file in video format.
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="flex justify-evenly w-full">
                                    <div className="file-input shadow-xl">
                                        <input
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setUploading(true);
                                                    handleUpload(
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                            id={"upload-showreel"}
                                            type="file"
                                            className="inputFile"
                                        />
                                        <label htmlFor={"upload-showreel"}>
                                            Upload New
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {videos.map(
                                        (video: Videos, index: number) => {
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
                                                            onOpenChangePreviewVideo();
                                                        }}
                                                        className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4">
                                                        <Image
                                                            height={100}
                                                            width={100}
                                                            src={
                                                                process.env
                                                                    .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                "play.png"
                                                            }
                                                            alt="play"
                                                            className="w-full h-auto m-auto"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        {video.name}
                                                    </div>
                                                    <div className="flex justify-center mt-2">
                                                        <button
                                                            onClick={() => {
                                                                setShowreel(
                                                                    video.name
                                                                );
                                                                onClose();
                                                            }}
                                                            className="px-10 py-2 bg-orange-400 rounded">
                                                            Select
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {showreel ? (
                                    <button
                                        onClick={() => {
                                            setShowreel("");
                                            onClose();
                                        }}
                                        className="px-10 py-2 bg-red-400 rounded-xl">
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
