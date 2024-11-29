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
import Link from "next/link";

// Types
import { CaseStudy, Images, Page, Segment, Videos } from "@prisma/client";
import { PageFormType } from "@/lib/types";

// Functions
import Markdown from "react-markdown";
import { updatePage } from "@/server/pageActions/updatePage";

// Context imports
import { NotificationsContext } from "../providers/NotificationProvider";
import PreviewVideoModal from "./Modals/PreviewVideoModal";
import ChangeVideoModal from "./Modals/ChangeVideoModal";

// Constants
const accordionBaseHeight = "3.5rem";

export default function PageEdit(props: {
    data: Page;
    videos: Videos[];
    images: Images[];
    segments: Segment[];
    caseStudies: CaseStudy[];
    hidden: boolean;
}) {
    // Preview Markdown text state
    const [previewText, setPreviewText] = useState(false);
    // State for unsaved changes
    const [changes, setChanges] = useState(false);
    // Notification Settings
    const { notifications, setNotifications } =
        useContext(NotificationsContext);
    // State to hold available videos and video selected for video view modal
    const [previewVideo, setPreviewVideo] = useState("");

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
    // Video pool modal for selecting video declaration
    const {
        isOpen: isOpenSelectBackgroundVideo,
        onOpenChange: onOpenChangeSelectBackgroundVideo,
    } = useDisclosure();
    // Video pool modal for selecting background video declaration
    const {
        isOpen: isOpenSelectVideo1,
        onOpenChange: onOpenChangeSelectVideo1,
    } = useDisclosure();
    // Video pool modal for selecting year review video declaration
    const {
        isOpen: isOpenSelectVideo2,
        onOpenChange: onOpenChangeSelectVideo2,
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

    // Pre-populate data with updated Page information
    async function handleUpdate(data: PageFormType) {
        try {
            const response = await updatePage(data);
            const updatedPage = JSON.parse(response.message) as Page;
            reset({
                page: props.data.title,
                subTitle: updatedPage.subTitle || "",
                description: updatedPage.description || "",
                header: updatedPage.header || "",
                video1: updatedPage.video1 || "",
                video2: updatedPage.video2 || "",
                backgroundVideo: updatedPage.backgroundVideo || "",
                videoOneButtonText: updatedPage.videoOneButtonText || "",
                videoTwoButtonText: updatedPage.videoTwoButtonText || "",
            });
        } catch (error) {
            console.error(error);
        }
    }

    function toggleAccordion(index: number) {
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
        <div
            className={`${
                props.hidden ? "hidden" : "block"
            } xl:mx-20 fade-in mb-10 xl:pb-0 pb-16`}>
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
                                                setPreviewVideo(
                                                    getValues("video1")
                                                );
                                                onOpenChangePreviewVideo();
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
                                                    onOpenChangeSelectVideo1();
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
                                                    onOpenChangeSelectVideo1();
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
                                                setPreviewVideo(
                                                    getValues("video2")
                                                );
                                                onOpenChangePreviewVideo();
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
                                                    onOpenChangeSelectVideo2();
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
                                                    onOpenChangeSelectVideo2();
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
                                                setPreviewVideo(
                                                    getValues("backgroundVideo")
                                                );
                                                onOpenChangePreviewVideo();
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
                                                    onOpenChangeSelectBackgroundVideo();
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
                                                    onOpenChangeSelectBackgroundVideo();
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
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Preview video modal */}
            <PreviewVideoModal
                isOpenPreviewVideo={isOpenPreviewVideo}
                onOpenChangePreviewVideo={onOpenChangePreviewVideo}
                previewVideo={previewVideo}
            />
            {/* Change background Video modal */}
            <ChangeVideoModal
                videos={props.videos}
                isOpenSelectVideo={isOpenSelectBackgroundVideo}
                onOpenChangeSelectVideo={onOpenChangeSelectBackgroundVideo}
                onOpenChangePreviewVideo={onOpenChangePreviewVideo}
                setValue={setValue}
                hasVideoSet={getValues("backgroundVideo") ? true : false}
                modalTarget="backgroundVideo"
                modalTitle="Background Video"
                prefixCheck="HEADER"
            />
            {/* Change Video 1 modal */}
            <ChangeVideoModal
                videos={props.videos}
                isOpenSelectVideo={isOpenSelectVideo1}
                onOpenChangeSelectVideo={onOpenChangeSelectVideo1}
                onOpenChangePreviewVideo={onOpenChangePreviewVideo}
                setValue={setValue}
                hasVideoSet={getValues("video1") ? true : false}
                modalTarget="video1"
                modalTitle="Video 1"
                prefixCheck="VIDEO"
            />
            {/* Change video 2 modal */}
            <ChangeVideoModal
                videos={props.videos}
                isOpenSelectVideo={isOpenSelectVideo2}
                onOpenChangeSelectVideo={onOpenChangeSelectVideo2}
                onOpenChangePreviewVideo={onOpenChangePreviewVideo}
                setValue={setValue}
                hasVideoSet={getValues("video2") ? true : false}
                modalTarget="video2"
                modalTitle="Video 2"
                prefixCheck="VIDEO"
            />
        </div>
    );
}
