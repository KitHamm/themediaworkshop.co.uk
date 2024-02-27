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
    CircularProgress,
    Accordion,
    AccordionItem,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

// Components
import EditSegment from "../Segments/Segment";
import NewSegment from "../Segments/NewSegment";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";

// Types
import { Page, Segment, Videos } from "@prisma/client";

// Functions
import uploadHandler from "../uploadHandler";
import Markdown from "react-markdown";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
    bgVideos: Videos[];
}) {
    // If page has description and header set initial state of description and header
    const [description, setDescription] = useState(
        props.data.description ? props.data.description : ""
    );
    const [header, setHeader] = useState(
        props.data.header ? props.data.header : ""
    );
    const [subTitle, setSubTitle] = useState(
        props.data.subTitle ? props.data.subTitle : ""
    );
    // States of background video and showreel
    const [videoOne, setVideoOne] = useState(props.data.video);
    const [videoTwo, setVideoTwo] = useState(props.data.showreel);
    const [videoOneButtonText, setVideoOneButtonText] = useState(
        props.data.videoOneButtonText
    );
    const [videoTwoButtonText, setVideoTwoButtonText] = useState(
        props.data.videoTwoButtonText
    );

    const [year, setYear] = useState(props.data.year);

    // Media uploading and error state for if not a video
    const [uploading, setUploading] = useState(false);
    const [notVideoError, setNotVideoError] = useState(false);
    const [showreelNamingError, setShowreelNamingError] = useState(false);
    const [backgroundNamingError, setBackgroundNamingError] = useState(false);
    const [yearNamingError, setYearNamingError] = useState(false);

    // Preview Markdown text state
    const [previewText, setPreviewText] = useState(false);
    // State for unsaved changes
    const [changes, setChanges] = useState(false);

    // State to hold available videos and video selected for video view modal
    const [videos, setVideos] = useState<Videos[]>([]);
    const [previewVideo, setPreviewVideo] = useState("");

    // New segment modal declaration
    const {
        isOpen: isOpenAddSegment,
        onOpen: onOpenAddSegment,
        onOpenChange: onOpenChangeAddSegment,
    } = useDisclosure();
    // Background video preview modal declaration
    const {
        isOpen: isOpenVideoModal,
        onOpen: onOpenVideoModal,
        onOpenChange: onOpenChangeVideoModal,
    } = useDisclosure();
    // Showreel preview modal declaration
    const {
        isOpen: isOpenShowreelModal,
        onOpen: onOpenShowreelModal,
        onOpenChange: onOpenChangeShowreelModal,
    } = useDisclosure();
    // Year In Review preview modal declaration
    const {
        isOpen: isOpenYearModal,
        onOpen: onOpenYearModal,
        onOpenChange: onOpenChangeYearModal,
    } = useDisclosure();
    // Video pool modal for selecting background video declaration
    const {
        isOpen: isOpenSelectVideo,
        onOpen: onOpenSelectVideo,
        onOpenChange: onOpenChangeSelectVideo,
    } = useDisclosure();
    // Video pool modal for selecting background video declaration
    const {
        isOpen: isOpenSelectShowreel,
        onOpen: onOpenSelectShowreel,
        onOpenChange: onOpenChangeSelectShowreel,
    } = useDisclosure();
    // Video pool modal for selecting year review video declaration
    const {
        isOpen: isOpenSelectYear,
        onOpen: onOpenSelectYear,
        onOpenChange: onOpenChangeSelectYear,
    } = useDisclosure();
    // View already selected video modal
    const {
        isOpen: isOpenPreviewVideo,
        onOpen: onOpenPreviewVideo,
        onOpenChange: onOpenChangePreviewVideo,
    } = useDisclosure();

    // Constant check for changes on the page
    useEffect(() => {
        if (
            subTitle !== props.data.subTitle ||
            description !== props.data.description ||
            header !== props.data.header ||
            videoOne !== props.data.video ||
            videoTwo !== props.data.showreel ||
            videoOneButtonText !== props.data.videoOneButtonText ||
            videoTwoButtonText !== props.data.videoTwoButtonText ||
            year !== props.data.year
        ) {
            setChanges(true);
        } else {
            setChanges(false);
        }
    }, [
        subTitle,
        description,
        header,
        videoOne,
        videoTwo,
        videoOneButtonText,
        videoTwoButtonText,
        year,
        props.data.subTitle,
        props.data.description,
        props.data.header,
        props.data.video,
        props.data.showreel,
        props.data.videoOneButtonText,
        props.data.videoTwoButtonText,
        props.data.year,
    ]);

    function namingErrorCheck(fileName: string, check: string) {
        if (fileName.split("_")[0] === check) {
            return true;
        } else {
            return false;
        }
    }

    async function uploadVideo(file: File) {
        if (file.type.split("/")[0] !== "video") {
            setNotVideoError(true);
            setUploading(false);
            return;
        } else {
            await uploadHandler(file, "video")
                .then((res: any) => {
                    if (res.message) {
                        setUploading(false);
                        getVideos();
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    async function getVideos() {
        props.revalidateDashboard("/");
        fetch("/api/videos", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setVideos(json))
            .catch((err) => console.log(err));
    }

    // Pre populate data with update Page information
    function handleUpdate() {
        const json = {
            subTitle: subTitle,
            description: description,
            header: header,
            video: videoOne,
            showreel: videoTwo,
            year: year,
            videoOneButtonText: videoOneButtonText,
            videoTwoButtonText: videoTwoButtonText,
        };
        updatePage(json);
    }

    // Update page information with pre populated data
    async function updatePage(json: any) {
        await fetch("/api/updatepage", {
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
        <div
            className={`${
                props.hidden ? "hidden" : ""
            } xl:mx-20 fade-in mb-10  xl:pb-0 pb-16`}>
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
                        <div className="border-b pb-2 mb-4">Page Videos</div>
                        <div className="grid xl:grid-cols-3 grid-cols-2 grid-cols-1 gap-4 xl:gap-10 min-h-20 xl:mb-0 mb-4">
                            <div>
                                {videoTwo ? (
                                    <>
                                        <div className="text-center">
                                            Video 1
                                        </div>
                                        <div
                                            onClick={() => {
                                                onOpenChangeShowreelModal();
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
                                        <div className="text-center">
                                            {videoTwo.split("-")[0]}
                                        </div>
                                        <div className="text-center mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectShowreel();
                                                    getVideos();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Change
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            Video 1
                                        </div>
                                        <div className="text-center mt-4">
                                            None Selected
                                        </div>
                                        <div className="text-center mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectShowreel();
                                                    getVideos();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {year ? (
                                    <>
                                        <div className="text-center">
                                            Video 2
                                        </div>
                                        <div
                                            onClick={() => {
                                                onOpenChangeYearModal();
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
                                        <div className="text-center">
                                            {year.split("-")[0]}
                                        </div>
                                        <div className="text-center mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectYear();
                                                    getVideos();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Change
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            Video 2
                                        </div>
                                        <div className="text-center mt-4">
                                            None Selected
                                        </div>
                                        <div className="text-center mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectYear();
                                                    getVideos();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="">
                                {videoOne ? (
                                    <>
                                        <div className="text-center">
                                            Background
                                        </div>
                                        <div
                                            onClick={() => {
                                                onOpenChangeVideoModal();
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
                                            {videoOne.split("-")[0]}
                                        </div>
                                        <div className="text-center mt-2 mt-2">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectVideo();
                                                    getVideos();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Change
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            Background
                                        </div>
                                        <div className="text-center mt-4">
                                            None Selected
                                        </div>
                                        <div className="text-center mt-2 h-full">
                                            <button
                                                onClick={() => {
                                                    onOpenSelectVideo();
                                                    getVideos();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                            <div>
                                <div>
                                    Video One Button Text <em>(Left)</em>
                                </div>
                                <input
                                    value={videoOneButtonText}
                                    onChange={(e) =>
                                        setVideoOneButtonText(e.target.value)
                                    }
                                    className="text-black"
                                    type="text"
                                    placeholder="SHOWREEL"
                                />
                            </div>
                            <div>
                                <div>
                                    Video Two Button Text <em>(Middle)</em>
                                </div>
                                <input
                                    value={videoTwoButtonText}
                                    onChange={(e) =>
                                        setVideoTwoButtonText(e.target.value)
                                    }
                                    className="text-black"
                                    placeholder="YEAR REVIEW"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <div id="right-colum">
                        {props.data.title !== "home" && (
                            <div className="mb-2">
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
                        )}
                        <div>
                            <div className="border-b pb-2 mb-2">
                                Prefix Title
                            </div>
                            <input
                                className="text-black"
                                value={subTitle}
                                onChange={(e) => setSubTitle(e.target.value)}
                                type="text"
                            />
                        </div>
                        <div>
                            <div className="flex gap-4 w-full border-b pb-2 mb-2">
                                <div className="">Description</div>
                                <Popover className="dark" placement="right-end">
                                    <PopoverTrigger>
                                        <i
                                            aria-hidden
                                            className="fa-solid fa-circle-info fa-xl cursor-pointer my-auto"
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="text-left p-2 xl:w-96">
                                            <div className="font-bold text-xl border-b pb-2 mb-2">
                                                Text Info
                                            </div>
                                            <p className="mb-2">
                                                The text is rendered using
                                                Markdown. This means that you
                                                can add headers, links, and line
                                                breaks
                                            </p>
                                            <p className="mb-2">
                                                **Header** (bold text)
                                            </p>
                                            <p className="mb-2">
                                                [Link Text
                                                Here](https://link-here.com/)
                                            </p>
                                            <p>New line\</p>
                                            <p>\</p>
                                            <p>New Paragraph</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <button
                                    onClick={() => setPreviewText(!previewText)}
                                    className="text-orange-600 cursor-pointer">
                                    {previewText ? "Edit" : "Preview"}
                                </button>
                            </div>
                            {previewText ? (
                                <div className="h-52">
                                    <Markdown>{description}</Markdown>
                                </div>
                            ) : (
                                <textarea
                                    value={description ? description : ""}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    name={"description-" + props.data.title}
                                    id={"description-" + props.data.title}
                                    className="text-black h-52"
                                />
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdate();
                                    }}
                                    disabled={!changes}
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-400 bg-orange-600 disabled:text-black rounded-md xl:px-4 xl:py-2 px-2 py-1">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="segments">
                    <div className="flex gap-5 border-b pb-2 mt-10 mb-2">
                        <div className="font-bold text-2xl">Segments</div>
                        <button
                            onClick={onOpenAddSegment}
                            className="px-2 py-1 bg-orange-600 rounded">
                            Add Segment
                        </button>
                    </div>
                    <Accordion variant="splitted">
                        {props.data.segment.map(
                            (segment: Segment, index: number) => {
                                return (
                                    <AccordionItem
                                        className="dark"
                                        startContent={
                                            segment.published ? (
                                                <div className="text-green-600 font-bold">
                                                    LIVE
                                                </div>
                                            ) : (
                                                <div className="text-red-400 font-bold">
                                                    DRAFT
                                                </div>
                                            )
                                        }
                                        key={index}
                                        aria-label={segment.title}
                                        title={
                                            <div className="text-sm xl:text-base">
                                                {segment.title
                                                    ? segment.title
                                                    : "Untitled Segment"}
                                            </div>
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
            {/* Add segment modal */}
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
                                        setNotVideoError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Preview selectable video modal */}
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
                                    playsInline
                                    disablePictureInPicture
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
                                        setNotVideoError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Preview Background Video Modal */}
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
                                    playsInline
                                    disablePictureInPicture
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        videoOne
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        setNotVideoError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Preview showreel modal */}
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
                                    playsInline
                                    disablePictureInPicture
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        videoOne
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        setNotVideoError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Preview Year Video Modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenYearModal}
                className="dark"
                scrollBehavior="inside"
                onOpenChange={onOpenChangeYearModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Year In Review
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <video
                                    playsInline
                                    disablePictureInPicture
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        year
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        setNotVideoError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Change background Video modal */}
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
                                {notVideoError && (
                                    <div className="w-full text-center text-red-400">
                                        Please Upload file in video format.
                                    </div>
                                )}
                                {backgroundNamingError && (
                                    <div className="w-full text-center text-red-400">
                                        File name should be prefixed with
                                        HEADER_
                                    </div>
                                )}
                                <div className="flex justify-evenly w-full">
                                    {uploading ? (
                                        <CircularProgress
                                            color="warning"
                                            aria-label="Loading..."
                                        />
                                    ) : (
                                        <div className="file-input shadow-xl">
                                            <input
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        if (
                                                            namingErrorCheck(
                                                                e.target
                                                                    .files[0]
                                                                    .name,
                                                                "HEADER"
                                                            )
                                                        ) {
                                                            setUploading(true);
                                                            setBackgroundNamingError(
                                                                false
                                                            );
                                                            uploadVideo(
                                                                e.target
                                                                    .files[0]
                                                            );
                                                        } else {
                                                            setBackgroundNamingError(
                                                                true
                                                            );
                                                            e.target.value = "";
                                                        }
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
                                    )}
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                    {videos.map(
                                        (video: Videos, index: number) => {
                                            if (
                                                video.name.split("_")[0] ===
                                                "HEADER"
                                            ) {
                                                return (
                                                    <div
                                                        key={
                                                            video.name +
                                                            "-" +
                                                            index
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
                                                                    setVideoOne(
                                                                        video.name
                                                                    );
                                                                    onClose();
                                                                    setBackgroundNamingError(
                                                                        false
                                                                    );
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
                            <ModalFooter>
                                {videoOne ? (
                                    <button
                                        onClick={() => {
                                            setVideoOne("");
                                            onClose();
                                            setNotVideoError(false);
                                            setBackgroundNamingError(false);
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
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Change showreel video modal */}
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
                                {notVideoError && (
                                    <div className="w-full text-center text-red-400">
                                        Please Upload file in video format.
                                    </div>
                                )}
                                {showreelNamingError && (
                                    <div className="w-full text-center text-red-400">
                                        File name should be prefixed with
                                        SHOWREEL_
                                    </div>
                                )}
                                <div className="flex justify-evenly w-full">
                                    {uploading ? (
                                        <CircularProgress
                                            color="warning"
                                            aria-label="Loading..."
                                        />
                                    ) : (
                                        <div className="file-input shadow-xl">
                                            <input
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        if (
                                                            namingErrorCheck(
                                                                e.target
                                                                    .files[0]
                                                                    .name,
                                                                "SHOWREEL"
                                                            )
                                                        ) {
                                                            setUploading(true);
                                                            setShowreelNamingError(
                                                                false
                                                            );
                                                            uploadVideo(
                                                                e.target
                                                                    .files[0]
                                                            );
                                                        } else {
                                                            setShowreelNamingError(
                                                                true
                                                            );
                                                            e.target.value = "";
                                                        }
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
                                    )}
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                    {videos.map(
                                        (video: Videos, index: number) => {
                                            if (
                                                video.name.split("_")[0] ===
                                                "SHOWREEL"
                                            ) {
                                                return (
                                                    <div
                                                        key={
                                                            video.name +
                                                            "-" +
                                                            index
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
                                                                    "/images/play.png"
                                                                }
                                                                alt="play"
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                        <div className="text-center">
                                                            {
                                                                video.name.split(
                                                                    "-"
                                                                )[0]
                                                            }
                                                        </div>
                                                        <div className="flex justify-center mt-2">
                                                            <button
                                                                onClick={() => {
                                                                    setVideoTwo(
                                                                        video.name
                                                                    );
                                                                    onClose();
                                                                    setShowreelNamingError(
                                                                        false
                                                                    );
                                                                    setNotVideoError(
                                                                        false
                                                                    );
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
                            <ModalFooter>
                                {videoTwo ? (
                                    <button
                                        onClick={() => {
                                            setVideoTwo("");
                                            onClose();
                                            setNotVideoError(false);
                                            setShowreelNamingError(false);
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
                                        setShowreelNamingError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Change year in review video modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenSelectYear}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeSelectYear}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Year In Review
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {notVideoError && (
                                    <div className="w-full text-center text-red-400">
                                        Please Upload file in video format.
                                    </div>
                                )}
                                {yearNamingError && (
                                    <div className="w-full text-center text-red-400">
                                        File name should be prefixed with YEAR_
                                    </div>
                                )}
                                <div className="flex justify-evenly w-full">
                                    {uploading ? (
                                        <CircularProgress
                                            color="warning"
                                            aria-label="Loading..."
                                        />
                                    ) : (
                                        <div className="file-input shadow-xl">
                                            <input
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        if (
                                                            namingErrorCheck(
                                                                e.target
                                                                    .files[0]
                                                                    .name,
                                                                "YEAR"
                                                            )
                                                        ) {
                                                            setUploading(true);
                                                            setYearNamingError(
                                                                false
                                                            );
                                                            uploadVideo(
                                                                e.target
                                                                    .files[0]
                                                            );
                                                        } else {
                                                            setYearNamingError(
                                                                true
                                                            );
                                                            e.target.value = "";
                                                        }
                                                    }
                                                }}
                                                id={"upload-year"}
                                                type="file"
                                                className="inputFile"
                                            />
                                            <label htmlFor={"upload-year"}>
                                                Upload New
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                    {videos.map(
                                        (video: Videos, index: number) => {
                                            if (
                                                video.name.split("_")[0] ===
                                                "YEAR"
                                            ) {
                                                return (
                                                    <div
                                                        key={
                                                            video.name +
                                                            "-" +
                                                            index
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
                                                                    "/images/play.png"
                                                                }
                                                                alt="play"
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                        <div className="text-center">
                                                            {
                                                                video.name.split(
                                                                    "-"
                                                                )[0]
                                                            }
                                                        </div>
                                                        <div className="flex justify-center mt-2">
                                                            <button
                                                                onClick={() => {
                                                                    setYear(
                                                                        video.name
                                                                    );
                                                                    onClose();
                                                                    setYearNamingError(
                                                                        false
                                                                    );
                                                                    setNotVideoError(
                                                                        false
                                                                    );
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
                            <ModalFooter>
                                {year ? (
                                    <button
                                        onClick={() => {
                                            setYear("");
                                            onClose();
                                            setNotVideoError(false);
                                            setYearNamingError(false);
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
                                        setNotVideoError(false);
                                        setYearNamingError(false);
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
