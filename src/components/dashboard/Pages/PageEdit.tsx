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
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

// Components
import EditSegment from "../Segments/Segment";
import NewSegment from "../Segments/NewSegment";

// React Components
import { useContext, useEffect, useRef, useState } from "react";

// Next Components
import Image from "next/image";

// Types
import { CaseStudy, Images, Page, Segment, Videos } from "@prisma/client";
interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}
export type PageFormType = {
    page: string;
    subTitle: string;
    description: string;
    header: string;
    video1: string;
    video2: string;
    backgroundVideo: string;
    videoOneButtonText: string;
    videoTwoButtonText: string;
};

// Functions
import Markdown from "react-markdown";
import axios from "axios";

// Context imports
import { NotificationsContext } from "../DashboardMain";
import Link from "next/link";
import { UpdatePage } from "@/components/server/pageActions/updatePage";

// Constants
const accordionBaseHeight = "3.5rem";

export default function PageEdit(props: {
    data: Page;
    videos: Videos[];
    images: Images[];
    segments: Segment[];
    caseStudies: CaseStudy[];
}) {
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
    // Notification Settings
    const [notifications, setNotifications] = useContext(NotificationsContext);
    // State to hold available videos and video selected for video view modal
    const [previewVideo, setPreviewVideo] = useState("");

    // Upload Progress
    const [uploadProgress, setUploadProgress] = useState(0);

    // Segment Accordion Ref
    const accordionItem = useRef<HTMLDivElement[]>([]);

    // Form Declarations
    const pageForm = useForm<PageFormType>({
        defaultValues: {
            page: props.data.title,
            subTitle: props.data.subTitle ? props.data.subTitle : "",
            description: props.data.description ? props.data.description : "",
            header: props.data.header ? props.data.header : "",
            video1: props.data.video1 ? props.data.video1 : "",
            video2: props.data.video2 ? props.data.video2 : "",
            backgroundVideo: props.data.backgroundVideo
                ? props.data.backgroundVideo
                : "",
            videoOneButtonText: props.data.videoOneButtonText
                ? props.data.videoOneButtonText
                : "",
            videoTwoButtonText: props.data.videoTwoButtonText
                ? props.data.videoTwoButtonText
                : "",
        },
    });
    const { register, handleSubmit, formState, getValues, setValue, reset } =
        pageForm;
    const { isDirty } = formState;

    // New segment modal declaration
    const {
        isOpen: isOpenAddSegment,
        onOpen: onOpenAddSegment,
        onOpenChange: onOpenChangeAddSegment,
    } = useDisclosure();
    // Background video preview modal declaration
    const { isOpen: isOpenVideoModal, onOpenChange: onOpenChangeVideoModal } =
        useDisclosure();
    // Showreel preview modal declaration
    const {
        isOpen: isOpenShowreelModal,
        onOpenChange: onOpenChangeShowreelModal,
    } = useDisclosure();
    // Year In Review preview modal declaration
    const { isOpen: isOpenYearModal, onOpenChange: onOpenChangeYearModal } =
        useDisclosure();
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
        onOpenChange: onOpenChangePreviewVideo,
    } = useDisclosure();

    function checkNotifications(notification: {
        component: string;
        title: string;
    }) {
        for (let i = 0; i < notifications.length; i++) {
            if (
                notification.component === notifications[i].component &&
                notification.title === notifications[i].title
            ) {
                return true;
            }
        }
        return false;
    }

    // Check for form changes
    useEffect(() => {
        if (isDirty) {
            if (
                !checkNotifications({
                    component: "Page",
                    title: props.data.title,
                })
            ) {
                setNotifications([
                    ...notifications,
                    { component: "Page", title: props.data.title },
                ]);
            }
            setChanges(true);
        } else {
            let _temp = [];
            for (let i = 0; i < notifications.length; i++) {
                if (notifications[i].title !== props.data.title) {
                    _temp.push(notifications[i]);
                }
            }
            setNotifications(_temp);
            setChanges(false);
        }
    }, [isDirty]);

    function namingErrorCheck(fileName: string, check: string) {
        if (fileName.split("_")[0] === check) {
            return true;
        } else {
            return false;
        }
    }

    async function uploadVideo(file: File) {
        setUploadProgress(0);
        if (file.type.split("/")[0] !== "video") {
            setNotVideoError(true);
            setUploading(false);
            return;
        } else {
            const formData = new FormData();
            formData.append("file", file);
            axios
                .post("/api/video", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (ProgressEvent) => {
                        if (ProgressEvent.bytes) {
                            let percent = Math.round(
                                (ProgressEvent.loaded / ProgressEvent.total!) *
                                    100
                            );
                            setUploadProgress(percent);
                        }
                    },
                })
                .then((res) => {
                    if (res.data.message) {
                        setUploading(false);
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    // Pre populate data with update Page information
    function handleUpdate(data: PageFormType) {
        UpdatePage(data)
            .then((res) => {
                const json: Page = JSON.parse(res.message);
                reset({
                    page: props.data.title,
                    subTitle: json.subTitle ? json.subTitle : "",
                    description: json.description ? json.description : "",
                    header: json.header ? json.header : "",
                    video1: json.video1 ? json.video1 : "",
                    video2: json.video2 ? json.video2 : "",
                    backgroundVideo: json.backgroundVideo
                        ? json.backgroundVideo
                        : "",
                    videoOneButtonText: json.videoOneButtonText
                        ? json.videoOneButtonText
                        : "",
                    videoTwoButtonText: json.videoTwoButtonText
                        ? json.videoTwoButtonText
                        : "",
                });
            })
            .catch((err) => console.log(err));
    }

    function toggleAccordion(index: number) {
        // const accordion = document.getElementById("accordion-" + index);
        // if (accordion) {
        //     if (accordion.style.height === accordionBaseHeight) {
        //         accordion.style.height = accordion?.scrollHeight + "px";
        //     } else {
        //         accordion.style.height = accordionBaseHeight;
        //     }
        // }
        for (let i = 0; i < accordionItem.current.length; i++) {
            if (accordionItem.current[i].id === "accordion-" + index) {
                if (
                    accordionItem.current[i].style.height ===
                    accordionBaseHeight
                ) {
                    accordionItem.current[i].style.height =
                        accordionItem.current[i].scrollHeight + "px";
                } else {
                    accordionItem.current[i].style.height = accordionBaseHeight;
                }
            } else {
                accordionItem.current[i].style.height = accordionBaseHeight;
            }
        }
    }

    function checkChanges(title: string) {
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].title === title) return true;
        }
        return false;
    }

    return (
        <div className={`xl:mx-20 fade-in mb-10  xl:pb-0 pb-16`}>
            <div className="my-10 border-b py-4 flex justify-between">
                <div className="hover:text-orange-600 transition-all font-bold capitalize">
                    <Link
                        className="text-3xl"
                        target="_blank"
                        rel="noreferrer"
                        href={
                            props.data.title === "home"
                                ? "/"
                                : "/" + props.data.title
                        }>
                        {props.data.title}
                    </Link>
                    <i
                        aria-hidden
                        className={
                            "ms-2 text-orange-600 fa-solid fa-arrow-up-right-from-square fa-sm"
                        }
                    />
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
                <form
                    onSubmit={handleSubmit(handleUpdate)}
                    id="top"
                    className="xl:grid xl:grid-cols-2 xl:gap-10">
                    <div id="left-column">
                        <div className="border-b pb-2 mb-4">Page Videos</div>
                        <div className="grid xl:grid-cols-3 grid-cols-2 grid-cols-1 gap-4 xl:gap-10 min-h-20 xl:mb-0 mb-4">
                            <div>
                                {getValues("video1") ? (
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
                                        <div className="text-center truncate">
                                            {getValues("video1").split("-")[0]}
                                        </div>
                                        <div className="text-center mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onOpenSelectShowreel();
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
                                                type="button"
                                                onClick={() => {
                                                    onOpenSelectShowreel();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {getValues("video2") ? (
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
                                        <div className="text-center truncate">
                                            {getValues("video2").split("-")[0]}
                                        </div>
                                        <div className="text-center mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onOpenSelectYear();
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
                                                type="button"
                                                onClick={() => {
                                                    onOpenSelectYear();
                                                }}
                                                className="xl:px-10 xl:py-2 px-2 py-1 bg-orange-600 rounded m-auto">
                                                Select
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="">
                                {getValues("backgroundVideo") ? (
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
                                            {
                                                getValues(
                                                    "backgroundVideo"
                                                ).split("-")[0]
                                            }
                                        </div>
                                        <div className="text-center mt-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onOpenSelectVideo();
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
                                                type="button"
                                                onClick={() => {
                                                    onOpenSelectVideo();
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
                                    {...register("videoOneButtonText")}
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
                                    {...register("videoTwoButtonText")}
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
                                    {...register("header")}
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
                                {...register("subTitle")}
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
                                    type="button"
                                    onClick={() => {
                                        setPreviewText(!previewText);
                                    }}
                                    className="text-orange-600 cursor-pointer">
                                    {previewText ? "Edit" : "Preview"}
                                </button>
                            </div>
                            {previewText ? (
                                <div className="h-52">
                                    <Markdown>
                                        {getValues("description")}
                                    </Markdown>
                                </div>
                            ) : (
                                <textarea
                                    {...register("description")}
                                    className="text-black h-52"
                                />
                            )}

                            <div className="flex justify-end gap-4">
                                {changes && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                        }}
                                        className="px-2 text-orange-400 hover:text-red-400">
                                        Discard
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={!changes}
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-400 bg-green-400 disabled:text-black rounded-md xl:px-4 xl:py-2 px-2 py-1">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div id="segments">
                    <div className="flex gap-5 border-b pb-2 mt-10 mb-2">
                        <div className="font-bold text-2xl">Segments</div>
                        <button
                            onClick={onOpenAddSegment}
                            className="px-2 py-1 bg-orange-600 rounded">
                            Add Segment
                        </button>
                    </div>
                    {props.segments
                        .filter(function (segment: Segment) {
                            return segment.pageId === props.data.id;
                        })
                        .map((segment: Segment, index: number) => {
                            return (
                                <div
                                    id={"accordion-" + index}
                                    ref={(el: HTMLDivElement) => {
                                        accordionItem.current![index] = el;
                                    }}
                                    key={"test-" + index}
                                    style={{ height: accordionBaseHeight }}
                                    className={`drop-shadow-kg overflow-hidden transition-all rounded-lg mx-2 mb-2 bg-zinc-800`}>
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleAccordion(index);
                                        }}
                                        className="xl:hover:bg-neutral-700 truncate transition-all w-full h-14 cursor-pointer flex px-4 gap-4">
                                        <div className="my-auto flex gap-4">
                                            {segment.published ? (
                                                <div className="text-green-600 font-bold">
                                                    LIVE
                                                </div>
                                            ) : (
                                                <div className="text-red-400 font-bold">
                                                    DRAFT
                                                </div>
                                            )}
                                            <div className="xl:text-base">
                                                {segment.title
                                                    ? segment.title
                                                    : "Untitled Segment"}
                                            </div>
                                        </div>
                                        {checkChanges(
                                            segment.title ? segment.title : ""
                                        ) && (
                                            <>
                                                <div className="fade-in hidden xl:block text-red-400 font-bold my-auto text-base xl:text-base">
                                                    Unsaved Changes
                                                </div>
                                                <div className="fade-in xl:hidden m-auto bg-red-800 bg-opacity-75 rounded-full flex justify-center p-2">
                                                    <i
                                                        aria-hidden
                                                        className="my-auto text-red-400 fa-solid fa-exclamation"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="px-4">
                                        <EditSegment
                                            title={props.data.title}
                                            segment={segment}
                                            index={index}
                                            images={props.images}
                                            videos={props.videos}
                                            caseStudies={props.caseStudies}
                                        />
                                    </div>
                                </div>
                            );
                        })}
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
                                    segmentCount={
                                        props.segments.filter(function (
                                            segment: Segment
                                        ) {
                                            return (
                                                segment.pageId === props.data.id
                                            );
                                        }).length
                                    }
                                    images={props.images}
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
                                        process.env
                                            .NEXT_PUBLIC_BASE_VIDEO_URL! +
                                        getValues("backgroundVideo")
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
            {/* Preview video 1 modal */}
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
                                    Video 1
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <video
                                    playsInline
                                    disablePictureInPicture
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env
                                            .NEXT_PUBLIC_BASE_VIDEO_URL! +
                                        getValues("video1")
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
            {/* Preview Video 2 Modal */}
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
                                    Video 2
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <video
                                    playsInline
                                    disablePictureInPicture
                                    id="bg-video"
                                    controls={true}
                                    src={
                                        process.env
                                            .NEXT_PUBLIC_BASE_VIDEO_URL! +
                                        getValues("video2")
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
                                            classNames={{
                                                svg: "w-20 h-20 drop-shadow-md",
                                                value: "text-xl",
                                            }}
                                            showValueLabel={true}
                                            value={uploadProgress}
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
                                    {props.videos.map(
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
                                                                    setValue(
                                                                        "backgroundVideo",
                                                                        video.name,
                                                                        {
                                                                            shouldDirty:
                                                                                true,
                                                                        }
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
                                {getValues("backgroundVideo") ? (
                                    <button
                                        onClick={() => {
                                            setValue("backgroundVideo", "", {
                                                shouldDirty: true,
                                            });
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
            {/* Change Video 1 video modal */}
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
                                    Video 1
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
                                        File name should be prefixed with VIDEO_
                                    </div>
                                )}
                                <div className="flex justify-evenly w-full">
                                    {uploading ? (
                                        <CircularProgress
                                            classNames={{
                                                svg: "w-20 h-20 drop-shadow-md",
                                                value: "text-xl",
                                            }}
                                            showValueLabel={true}
                                            value={uploadProgress}
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
                                                                "VIDEO"
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
                                    {props.videos.map(
                                        (video: Videos, index: number) => {
                                            if (
                                                video.name.split("_")[0] ===
                                                "VIDEO"
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
                                                                    setValue(
                                                                        "video1",
                                                                        video.name,
                                                                        {
                                                                            shouldDirty:
                                                                                true,
                                                                        }
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
                                {getValues("video1") ? (
                                    <button
                                        onClick={() => {
                                            setValue("video1", "", {
                                                shouldDirty: true,
                                            });
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
            {/* Change video 2 modal */}
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
                                    Video 2
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
                                        File name should be prefixed with VIDEO_
                                    </div>
                                )}
                                <div className="flex justify-evenly w-full">
                                    {uploading ? (
                                        <CircularProgress
                                            classNames={{
                                                svg: "w-20 h-20 drop-shadow-md",
                                                value: "text-xl",
                                            }}
                                            showValueLabel={true}
                                            value={uploadProgress}
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
                                                                "VIDEO"
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
                                    {props.videos.map(
                                        (video: Videos, index: number) => {
                                            if (
                                                video.name.split("_")[0] ===
                                                "VIDEO"
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
                                                                    setValue(
                                                                        "video2",
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
                                {getValues("video2") ? (
                                    <button
                                        onClick={() => {
                                            setValue("video2", "", {
                                                shouldDirty: true,
                                            });
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
