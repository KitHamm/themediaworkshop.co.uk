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
    Select,
    SelectItem,
} from "@nextui-org/react";

// React Components
import { useContext, useEffect, useState } from "react";

// Next Components
import Image from "next/image";

// Components
import EditCaseStudy from "../CaseStudy/EditCaseStudy";
import NewCaseStudy from "../CaseStudy/NewCaseStudy";

// Types
import { CaseStudy, Images, Segment, Videos } from "@prisma/client";
import { toLink } from "@prisma/client";

export type ImageFormType = {
    url: string;
};

export type VideoFormType = {
    url: string;
};
export type SegmentFormType = {
    id: number;
    title: string;
    copy: string;
    image: ImageFormType[];
    video: VideoFormType[];
    headerImage: string;
    order: number;
    buttonText: string;
    linkTo: toLink;
};

// Functions
import Markdown from "react-markdown";
import axios from "axios";

// Context imports
import { NotificationsContext } from "../DashboardMain";
import { useFieldArray, useForm } from "react-hook-form";
import {
    updateSegment,
    updateSegmentPublish,
} from "@/components/server/segmentActions/updateSegment";
import { deleteSegment as deleteSegmentSA } from "@/components/server/segmentActions/deleteSegment";

export default function EditSegment(props: {
    segment: Segment;
    index: number;
    title: string;
    images: Images[];
    caseStudies: CaseStudy[];
    videos: Videos[];
}) {
    // Form
    const segmentForm = useForm<SegmentFormType>();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        control: segmentControl,
        formState: { isDirty, errors },
    } = segmentForm;

    const {
        fields: imageFields,
        append: imageAppend,
        remove: imageRemove,
    } = useFieldArray({
        control: segmentControl,
        name: "image",
    });

    const {
        fields: videoFields,
        append: videoAppend,
        remove: videoRemove,
    } = useFieldArray({
        control: segmentControl,
        name: "video",
    });

    // Set initial form state
    useEffect(() => {
        handleReset();
    }, [props.segment]);

    function handleReset() {
        const images: ImageFormType[] = [];
        const videos: VideoFormType[] = [];

        for (let i = 0; i < props.segment.image.length; i++) {
            images.push({ url: props.segment.image[i] });
        }
        for (let i = 0; i < props.segment.video.length; i++) {
            videos.push({ url: props.segment.video[i] });
        }
        reset({
            id: props.segment.id,
            title: props.segment.title ? props.segment.title : "",
            copy: props.segment.copy ? props.segment.copy : "",
            image: images,
            video: videos,
            headerImage: props.segment.headerimage
                ? props.segment.headerimage
                : "",
            order: props.segment.order ? props.segment.order : -1,
            buttonText: props.segment.buttonText
                ? props.segment.buttonText
                : "",
            linkTo: props.segment.linkTo ? props.segment.linkTo : toLink.NONE,
        });
    }

    // State for naming convention errors on upload
    const [topImageNamingError, setTopImageNamingError] = useState(false);
    const [segmentImageNamingError, setSegmentImageNamingError] =
        useState(false);

    // State to re render the publish state
    const [published, setPublished] = useState(props.segment.published);

    // Uploading State
    const [uploading, setUploading] = useState(false);
    const [notImageError, setNotImageError] = useState(false);

    // State for description preview
    const [previewText, setPreviewText] = useState(false);

    // State for if there are unsaved changes on the segment
    const [changes, setChanges] = useState(false);

    // Notification Settings
    const [notifications, setNotifications] = useContext(NotificationsContext);

    // State for selected case study to edit
    const [selectedCaseStudy, setSelectedCaseStudy] = useState(0);

    // Delete States
    const [deleteError, setDeleteError] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    // Upload Progress
    const [uploadProgress, setUploadProgress] = useState(0);
    // Top image modal declaration
    const { isOpen: isOpenTopImage, onOpenChange: onOpenChangeTopImage } =
        useDisclosure();

    // Segment images modal declaration
    const { isOpen: isOpenAddImage, onOpenChange: onOpenChangeAddImage } =
        useDisclosure();

    // Edit case study modal declaration
    const {
        isOpen: isOpenEditCaseStudy,
        onOpenChange: onOpenChangeEditCaseStudy,
    } = useDisclosure();

    // New case study modal declaration
    const {
        isOpen: isOpenNewCaseStudy,
        onOpenChange: onOpenChangeNewCaseStudy,
    } = useDisclosure();

    // Delete warning modal declaration
    const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
        useDisclosure();

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

    // Constant check for unsaved changes
    useEffect(() => {
        if (isDirty) {
            if (
                !checkNotifications({
                    component: "Segment",
                    title: props.segment.title!,
                })
            ) {
                setNotifications([
                    ...notifications,
                    { component: "Segment", title: props.segment.title },
                ]);
            }
            setChanges(true);
        } else {
            let _temp = [];
            for (let i = 0; i < notifications.length; i++) {
                if (notifications[i].title !== props.segment.title) {
                    _temp.push(notifications[i]);
                }
            }
            setNotifications(_temp);
            setChanges(false);
        }
    }, [isDirty]);

    // Check naming conventions for uploads
    function namingConventionCheck(fileName: string, check: string) {
        if (fileName.split("_")[0] !== check) {
            return false;
        } else {
            return true;
        }
    }

    // Pre populate information for segment update
    function handleUpdate(segmentData: SegmentFormType) {
        updateSegment(segmentData)
            .then((res) => {
                const updatedSegment = JSON.parse(res.message) as Segment;

                const images = updatedSegment.image.map<ImageFormType>(
                    (url) => ({ url })
                );
                const videos = updatedSegment.video.map<VideoFormType>(
                    (url) => ({ url })
                );

                reset({
                    id: updatedSegment.id,
                    title: updatedSegment.title || "",
                    copy: updatedSegment.copy || "",
                    image: images,
                    video: videos,
                    headerImage: updatedSegment.headerimage || "",
                    order: updatedSegment.order || -1,
                    buttonText: updatedSegment.buttonText || "",
                    linkTo: updatedSegment.linkTo || toLink.NONE,
                });
            })
            .catch((err) => console.log(err));
    }

    async function uploadImage(file: File, target: string) {
        setUploadProgress(0);
        if (file.type.split("/")[0] !== "image") {
            setNotImageError(true);
            setUploading(false);
            return;
        } else {
            const formData = new FormData();
            formData.append("file", file);
            axios
                .post("/api/image", formData, {
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
                        if (target === "header") {
                            setValue("headerImage", res.data.message, {
                                shouldDirty: true,
                            });
                            clearFileInput(target);
                        } else {
                            clearFileInput(target);
                        }
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function clearFileInput(target: string) {
        var id = target === "header" ? "-top-image-input" : "-image-input";
        const inputElm = document.getElementById(
            props.segment.id + id
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    async function deleteSegment() {
        deleteSegmentSA(props.segment.id)
            .then(() => {
                setDeleteError(false);
                setDeleteSuccess(true);
            })
            .catch((err) => {
                setDeleteError(true);
                setDeleteSuccess(false);
                console.log(err.message);
            });
    }

    return (
        <>
            <div className="light rounded-md xl:px-5 mb-4 py-4">
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="xl:flex xl:justify-end">
                        <div className="flex flex-col-reverse xl:flex-row gap-4 mb-4 xl:mb-0">
                            {changes && (
                                <button
                                    type="button"
                                    onClick={() => handleReset()}
                                    className="py-2 text-orange-600 hover:text-red-400 rounded xl:ms-4">
                                    Discard
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={!changes}
                                className="disabled:bg-neutral-400 disabled:cursor-not-allowed px-4 py-2 bg-green-400 rounded xl:ms-4">
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    updateSegmentPublish(
                                        props.segment.id,
                                        !props.segment.published
                                    ).catch((err) => console.log(err));
                                }}
                                className={`${
                                    props.segment.published
                                        ? "bg-red-400"
                                        : "bg-orange-600"
                                } xl:px-4 xl:py-2 px-2 py-2 rounded`}>
                                {props.segment.published
                                    ? "UNPUBLISH"
                                    : "PUBLISH"}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <div className="text-orange-600 font-bold text-xl">
                            Top Image
                        </div>
                    </div>
                    <div className="relative my-2">
                        {getValues("headerImage") ? (
                            <div>
                                <Image
                                    height={2000}
                                    width={1000}
                                    src={
                                        process.env.NEXT_PUBLIC_BASE_IMAGE_URL +
                                        getValues("headerImage")
                                    }
                                    alt={getValues("headerImage")}
                                    className="w-full h-auto m-auto"
                                />
                                <div className="hover:opacity-100 flex justify-center transition-opacity opacity-0 absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                    <div className="m-auto flex w-1/2 justify-evenly">
                                        <div className="w-1/2 text-center">
                                            <i
                                                onClick={() => {
                                                    onOpenChangeTopImage();
                                                }}
                                                aria-hidden
                                                className="fa-solid cursor-pointer fa-pen-to-square fa-2xl"
                                            />
                                        </div>
                                        <div className="w-1/2 text-center">
                                            <i
                                                onClick={() =>
                                                    setValue(
                                                        "headerImage",
                                                        "",
                                                        { shouldDirty: true }
                                                    )
                                                }
                                                aria-hidden
                                                className="fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-black w-full flex justify-evenly py-10">
                                {uploading ? (
                                    <CircularProgress
                                        classNames={{
                                            svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                            value: "text-xl",
                                        }}
                                        showValueLabel={true}
                                        value={uploadProgress}
                                        color="warning"
                                        aria-label="Loading..."
                                    />
                                ) : (
                                    <div className="grid xl:grid-cols-2 xl:gap-40 gap-4">
                                        <div>
                                            {topImageNamingError && (
                                                <div className="text-center text-red-400">
                                                    File name prefix should be
                                                    SEGHEAD_
                                                </div>
                                            )}
                                            <div className="file-input shadow-xl">
                                                <input
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            if (
                                                                namingConventionCheck(
                                                                    e.target
                                                                        .files[0]
                                                                        .name,
                                                                    "SEGHEAD"
                                                                )
                                                            ) {
                                                                setUploading(
                                                                    true
                                                                );
                                                                uploadImage(
                                                                    e.target
                                                                        .files[0],
                                                                    "header"
                                                                );
                                                                setTopImageNamingError(
                                                                    false
                                                                );
                                                            } else {
                                                                setTopImageNamingError(
                                                                    true
                                                                );
                                                                clearFileInput(
                                                                    "header"
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    id={
                                                        props.segment.id +
                                                        "-top-image-input"
                                                    }
                                                    type="file"
                                                    className="inputFile"
                                                />
                                                <label
                                                    className="mx-auto"
                                                    htmlFor={
                                                        props.segment.id +
                                                        "-top-image-input"
                                                    }>
                                                    Upload New
                                                </label>
                                            </div>
                                            <div className="w-full text-center text-red-400">
                                                {notImageError
                                                    ? "Please upload media in Image format"
                                                    : ""}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onOpenChangeTopImage();
                                                }}
                                                className="bg-orange-600 py-3 px-20 rounded shadow-xl">
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="xl:grid xl:grid-cols-2 xl:gap-10 mt-8">
                        <div id={"left-segment-" + props.index + "-column"}>
                            <div>
                                <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                    Title
                                </div>
                                <input
                                    {...register("title", {
                                        required: {
                                            value: true,
                                            message: "Title is required.",
                                        },
                                    })}
                                    placeholder={
                                        errors.title
                                            ? errors.title.message
                                            : "Title"
                                    }
                                    type="text"
                                    className={`${
                                        errors.title
                                            ? "placeholder:text-red-400"
                                            : ""
                                    } text-black`}
                                />
                            </div>
                            <div className="mt-2">
                                <Select
                                    onChange={
                                        (e) =>
                                            setValue(
                                                "linkTo",
                                                e.target.value as toLink,
                                                { shouldDirty: true }
                                            )
                                        // setLinkTo(e.target.value as toLink)
                                    }
                                    selectedKeys={[getValues("linkTo")]}
                                    className="dark"
                                    variant="bordered"
                                    label={"Link To"}>
                                    <SelectItem
                                        className="text-black"
                                        key={"NONE"}
                                        value={"NONE"}>
                                        None
                                    </SelectItem>
                                    <SelectItem
                                        className="text-black"
                                        key={"FILM"}
                                        value={"FILM"}>
                                        Film
                                    </SelectItem>
                                    <SelectItem
                                        className="text-black"
                                        key={"DIGITAL"}
                                        value={"DIGITAL"}>
                                        Digital
                                    </SelectItem>
                                    <SelectItem
                                        className="text-black"
                                        key={"LIGHT"}
                                        value={"LIGHT"}>
                                        Light
                                    </SelectItem>
                                    <SelectItem
                                        className="text-black"
                                        key={"EVENTS"}
                                        value={"EVENTS"}>
                                        Events
                                    </SelectItem>
                                    <SelectItem
                                        className="text-black"
                                        key={"ART"}
                                        value={"ART"}>
                                        Art
                                    </SelectItem>
                                </Select>
                            </div>
                            <div>
                                <div className="flex gap-4 w-full border-b pb-2 mb-2 mt-6">
                                    <div className="text-orange-600 font-bold text-xl">
                                        Description
                                    </div>
                                    <Popover
                                        className="dark"
                                        placement="right-end">
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
                                                    Markdown. This means that
                                                    you can add headers, links,
                                                    and line breaks
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
                                        onClick={() =>
                                            setPreviewText(!previewText)
                                        }
                                        className="text-orange-600 cursor-pointer">
                                        {previewText ? "Edit" : "Preview"}
                                    </button>
                                </div>
                                {previewText ? (
                                    <div className="min-h-52">
                                        <Markdown>{getValues("copy")}</Markdown>
                                    </div>
                                ) : (
                                    <textarea
                                        {...register("copy", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Description is required.",
                                            },
                                        })}
                                        placeholder={
                                            errors.copy
                                                ? errors.copy.message
                                                : "Description"
                                        }
                                        className={`${
                                            errors.copy
                                                ? "placeholder:text-red-400"
                                                : ""
                                        } text-black h-52`}
                                    />
                                )}
                            </div>
                            <div className="flex gap-10">
                                <div className="xl:w-1/6 w-1/2">
                                    <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                        Order
                                    </div>
                                    <input
                                        className="text-black"
                                        {...register("order", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Please choose an order position",
                                            },
                                        })}
                                        type="number"
                                    />
                                </div>
                                <div className="w-full">
                                    <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                        Custom Button Text
                                    </div>
                                    <input
                                        className="text-black"
                                        {...register("buttonText")}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={
                                "right-segment-" + props.index + "-column"
                            }>
                            <div className="">
                                <div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
                                    Images
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-4 p-2">
                                    {imageFields.map(
                                        (
                                            image: ImageFormType,
                                            index: number
                                        ) => {
                                            return (
                                                <div
                                                    key={image + "-" + index}
                                                    className="relative">
                                                    <Image
                                                        height={100}
                                                        width={100}
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                            image.url
                                                        }
                                                        alt={image.url}
                                                        className="w-full h-auto"
                                                    />
                                                    <div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                                        <div className="text-red-400 h-full flex justify-center">
                                                            <i
                                                                onClick={() =>
                                                                    imageRemove(
                                                                        index
                                                                    )
                                                                }
                                                                aria-hidden
                                                                className="m-auto fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}

                                    <div
                                        onClick={() => {
                                            onOpenChangeAddImage();
                                        }}
                                        className="min-h-16 cursor-pointer w-full h-full bg-black hover:bg-opacity-25 transition-all bg-opacity-75 top-0 left-0">
                                        <div className="flex h-full justify-center">
                                            <i
                                                aria-hidden
                                                className="m-auto fa-solid fa-plus fa-2xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 border-b mt-6 bg">
                                <div className="py-4 text-orange-600 font-bold text-xl">
                                    Case Studies
                                </div>
                                <button
                                    type="button"
                                    onClick={onOpenChangeNewCaseStudy}
                                    className="px-2 py-1 my-auto rounded bg-orange-600">
                                    Add Case Study
                                </button>
                            </div>
                            <div className="text-green-600 font-bold text-lg my-4">
                                PUBLISHED
                            </div>
                            <div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-black xl:mt-2 rounded-lg px-2 min-h-10">
                                {props.caseStudies.map(
                                    (caseStudy: CaseStudy, index: number) => {
                                        if (
                                            caseStudy.segmentId ===
                                                props.segment.id &&
                                            caseStudy.published
                                        )
                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCaseStudy(
                                                            index
                                                        );
                                                        onOpenChangeEditCaseStudy();
                                                    }}
                                                    key={
                                                        caseStudy.title +
                                                        "-" +
                                                        index
                                                    }
                                                    className="transition-all hover:bg-orange-600 px-4 py-2 bg-neutral-600 rounded">
                                                    {caseStudy.title}
                                                </button>
                                            );
                                    }
                                )}
                            </div>
                            <div className="text-red-400 font-bold text-lg my-4">
                                DRAFTS
                            </div>
                            <div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-black xl:mt-2 rounded-lg px-2 min-h-10">
                                {props.caseStudies.map(
                                    (caseStudy: CaseStudy, index: number) => {
                                        if (
                                            caseStudy.segmentId ===
                                                props.segment.id &&
                                            !caseStudy.published
                                        )
                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCaseStudy(
                                                            index
                                                        );
                                                        onOpenChangeEditCaseStudy();
                                                    }}
                                                    key={
                                                        caseStudy.title +
                                                        "-" +
                                                        index
                                                    }
                                                    className="transition-all hover:bg-orange-600 px-4 py-2 bg-neutral-600 rounded">
                                                    {caseStudy.title}
                                                </button>
                                            );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onOpenChangeDelete}
                            className="px-4 py-2 hover:bg-red-800 hover:text-white text-red-600 rounded transition-all">
                            Delete
                        </button>
                    </div>
                </form>
                {/* Top Image modal */}
                <Modal
                    size="5xl"
                    backdrop="blur"
                    isOpen={isOpenTopImage}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeTopImage}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    {"Top Image for " + props.segment.title}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="grid xl:grid-cols-4 gap-5">
                                        {props.images.map(
                                            (image: Images, index: number) => {
                                                if (
                                                    image.name.split("_")[0] ===
                                                    "SEGHEAD"
                                                ) {
                                                    return (
                                                        <div
                                                            key={
                                                                image.name +
                                                                "-" +
                                                                index
                                                            }
                                                            className="flex cursor-pointer"
                                                            onClick={() => {
                                                                setValue(
                                                                    "headerImage",
                                                                    image.name,
                                                                    {
                                                                        shouldDirty:
                                                                            true,
                                                                    }
                                                                );
                                                                onClose();
                                                            }}>
                                                            <Image
                                                                height={300}
                                                                width={300}
                                                                src={
                                                                    process.env
                                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                    image.name
                                                                }
                                                                alt={image.name}
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                    );
                                                }
                                            }
                                        )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
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
                {/* Segment images select modal */}
                <Modal
                    size="2xl"
                    backdrop="blur"
                    isOpen={isOpenAddImage}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeAddImage}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold">
                                        Select or Upload Image
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    {segmentImageNamingError && (
                                        <div className="text-center text-red-400">
                                            File name prefix should be SEGMENT_
                                        </div>
                                    )}
                                    <div className="w-full flex justify-center mb-10">
                                        {uploading ? (
                                            <CircularProgress
                                                classNames={{
                                                    svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                                    value: "text-xl",
                                                }}
                                                showValueLabel={true}
                                                value={uploadProgress}
                                                color="warning"
                                                aria-label="Loading..."
                                            />
                                        ) : (
                                            <>
                                                <div className="file-input shadow-xl">
                                                    <input
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.files
                                                            ) {
                                                                if (
                                                                    namingConventionCheck(
                                                                        e.target
                                                                            .files[0]
                                                                            .name,
                                                                        "SEGMENT"
                                                                    )
                                                                ) {
                                                                    setSegmentImageNamingError(
                                                                        false
                                                                    );
                                                                    setUploading(
                                                                        true
                                                                    );
                                                                    uploadImage(
                                                                        e.target
                                                                            .files[0],
                                                                        "image"
                                                                    );
                                                                } else {
                                                                    setSegmentImageNamingError(
                                                                        true
                                                                    );
                                                                    clearFileInput(
                                                                        "SEGMENT"
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        id={
                                                            props.segment.id +
                                                            "-image-input"
                                                        }
                                                        type="file"
                                                        className="inputFile"
                                                    />
                                                    <label
                                                        htmlFor={
                                                            props.segment.id +
                                                            "-image-input"
                                                        }>
                                                        Upload New
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
                                        {props.images.map(
                                            (image: Images, index: number) => {
                                                if (
                                                    image.name.split("_")[0] ===
                                                    "SEGMENT"
                                                )
                                                    return (
                                                        <div
                                                            key={
                                                                image.name +
                                                                "-" +
                                                                index
                                                            }
                                                            className="flex cursor-pointer"
                                                            onClick={() => {
                                                                imageAppend({
                                                                    url: image.name,
                                                                });

                                                                onClose();
                                                            }}>
                                                            <Image
                                                                height={300}
                                                                width={300}
                                                                src={
                                                                    process.env
                                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                    image.name
                                                                }
                                                                alt={image.name}
                                                                className="w-full h-auto m-auto"
                                                            />
                                                        </div>
                                                    );
                                            }
                                        )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
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
                {/* Edit Case Study modal */}
                <Modal
                    size="5xl"
                    backdrop="blur"
                    hideCloseButton
                    isOpen={isOpenEditCaseStudy}
                    className="dark"
                    isDismissable={false}
                    scrollBehavior="outside"
                    onOpenChange={onOpenChangeEditCaseStudy}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader></ModalHeader>
                                <ModalBody>
                                    <EditCaseStudy
                                        caseStudyCount={
                                            props.caseStudies.filter(function (
                                                caseStudy: CaseStudy
                                            ) {
                                                return (
                                                    caseStudy.segmentId ===
                                                    props.segment.id
                                                );
                                            }).length
                                        }
                                        videos={props.videos}
                                        images={props.images}
                                        onClose={onClose}
                                        setSelectedCaseStudy={
                                            setSelectedCaseStudy
                                        }
                                        onOpenChangeEditCaseStudy={
                                            onOpenChangeEditCaseStudy
                                        }
                                        caseStudy={
                                            props.caseStudies[selectedCaseStudy]
                                        }
                                    />
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {/* New Case Study modal */}
                <Modal
                    size="5xl"
                    backdrop="blur"
                    isOpen={isOpenNewCaseStudy}
                    className="dark"
                    isDismissable={false}
                    scrollBehavior="outside"
                    onOpenChange={onOpenChangeNewCaseStudy}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center text-3xl font-bold text-orange-600">
                                        New Case Study
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    <NewCaseStudy
                                        images={props.images}
                                        videos={props.videos}
                                        studyCount={
                                            props.caseStudies.filter(function (
                                                caseStudy: CaseStudy
                                            ) {
                                                return (
                                                    caseStudy.segmentId ===
                                                    props.segment.id
                                                );
                                            }).length
                                        }
                                        segmentId={props.segment.id as number}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            onClose();
                                            setSelectedCaseStudy(0);
                                        }}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {/* Delete warning modal */}
                <Modal
                    size="2xl"
                    backdrop="blur"
                    isOpen={isOpenDelete}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeDelete}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold text-red-400">
                                        Are you sure?
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    {deleteError ? (
                                        <div>
                                            <div className="font-bold text-2xl text-center text-red-400">
                                                Unable to delete.
                                            </div>
                                            <div className="font-bold text-base text-center">
                                                Segment may have Case Studies.
                                                Please delete them first.
                                            </div>
                                        </div>
                                    ) : deleteSuccess ? (
                                        <div className="font-bold text-green-400 text-2xl text-center">
                                            Successfully Deleted
                                        </div>
                                    ) : (
                                        <div className="font-bold text-2xl text-center">
                                            {"Delete " +
                                                props.segment.title +
                                                "?"}
                                        </div>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    {!deleteError && !deleteSuccess && (
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={() => {
                                                deleteSegment();
                                            }}>
                                            Delete
                                        </Button>
                                    )}
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            onClose();
                                            setDeleteError(false);
                                            setDeleteSuccess(false);
                                        }}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
