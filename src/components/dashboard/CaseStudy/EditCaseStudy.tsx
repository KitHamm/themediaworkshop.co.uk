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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import Markdown from "react-markdown";

// React Components
import { useState, useEffect, useContext } from "react";

// Types
import { CaseStudy, Images, Videos } from "@prisma/client";
import Image from "next/image";
import { useFieldArray, useForm } from "react-hook-form";
import {
    CaseStudyFromType,
    CaseStudyImageType,
    CaseStudyTagType,
} from "@/lib/types";
import {
    updateCaseStudy,
    updateCaseStudyPublished,
} from "@/server/caseStudyActions/updateCaseStudy";
import { deleteCaseStudy } from "@/server/caseStudyActions/deleteCaseStudy";
import SegmentImagesModal from "../Segments/SegmentImagesModal";
import CaseStudyThumbnailModal from "./CaseStudyThumbnailModal";
import ChangeVideoModal from "../Pages/Modals/ChangeVideoModal";
import { DashboardStateContext } from "../DashboardStateProvider";
import PreviewVideoModal from "../Pages/Modals/PreviewVideoModal";
export default function EditCaseStudy(props: {
    caseStudy: CaseStudy;
    onOpenChangeEditCaseStudy: any;
    onClose: any;
    setSelectedCaseStudy: any;
    videos: Videos[];
    images: Images[];
    caseStudyCount: number;
}) {
    const { previewVideo, setPreviewVideo } = useContext(DashboardStateContext);

    const caseStudyForm = useForm<CaseStudyFromType>({
        defaultValues: {
            title: props.caseStudy.title,
            dateLocation: props.caseStudy.dateLocation
                ? props.caseStudy.dateLocation
                : "",
            copy: props.caseStudy.copy,
            image: [],
            video: props.caseStudy.video ? props.caseStudy.video : "",
            videoThumbnail: props.caseStudy.videoThumbnail
                ? props.caseStudy.videoThumbnail
                : "",
            tags: [],
            order: props.caseStudy.order
                ? props.caseStudy.order
                : props.caseStudyCount + 1,
            segmentId: props.caseStudy.segmentId,
            published: props.caseStudy.published,
        },
    });
    const {
        register,
        reset,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors, isDirty },
        control,
    } = caseStudyForm;
    const {
        fields: imageFields,
        append: imageAppend,
        remove: imageRemove,
    } = useFieldArray({
        control: control,
        name: "image",
    });
    const {
        fields: tagsFields,
        append: tagsAppend,
        remove: tagsRemove,
    } = useFieldArray({
        control: control,
        name: "tags",
    });

    function resetCaseStudyForm() {
        var images: CaseStudyImageType[] = [];
        var tags: CaseStudyTagType[] = [];

        for (let i = 0; i < props.caseStudy.image.length; i++) {
            images.push({ url: props.caseStudy.image[i] });
        }
        for (let i = 0; i < props.caseStudy.tags.length; i++) {
            tags.push({ text: props.caseStudy.tags[i] });
        }

        reset({
            title: props.caseStudy.title,
            dateLocation: props.caseStudy.dateLocation
                ? props.caseStudy.dateLocation
                : "",
            copy: props.caseStudy.copy,
            image: images,
            video: props.caseStudy.video ? props.caseStudy.video : "",
            videoThumbnail: props.caseStudy.videoThumbnail
                ? props.caseStudy.videoThumbnail
                : "",
            tags: tags,
            order: props.caseStudy.order
                ? props.caseStudy.order
                : props.caseStudyCount + 1,
            segmentId: props.caseStudy.segmentId,
            published: props.caseStudy.published,
        });
    }

    useEffect(() => {
        resetCaseStudyForm();
    }, [props.caseStudy]);

    // New Tag State
    const [newTag, setNewTag] = useState("");

    // State for preview description text
    const [previewText, setPreviewText] = useState(false);
    // State for if there are unsaved changes
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const [thumbnailImage, setThumbnailImage] = useState(
        props.caseStudy.videoThumbnail
    );

    // Image select modal declaration
    const { isOpen: isOpenImageSelect, onOpenChange: onOpenChangeImageSelect } =
        useDisclosure();

    // Thumbnail select modal declaration
    const {
        isOpen: isOpenThumbnailSelect,
        onOpenChange: onOpenChangeThumbnailSelect,
    } = useDisclosure();

    // Video select modal declaration
    const {
        isOpen: isOpenVideoSelect,
        onOpen: onOpenVideoSelect,
        onOpenChange: onOpenChangeVideoSelect,
    } = useDisclosure();

    // Video preview modal declaration
    const {
        isOpen: isOpenVideoPreview,
        onOpenChange: onOpenChangeVideoPreview,
    } = useDisclosure();

    // Unsaved Changes modal declaration
    const {
        isOpen: isOpenUnsavedChanges,
        onOpenChange: onOpenChangeUnsavedChanges,
    } = useDisclosure();

    // Delete warning modal declaration
    const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
        useDisclosure();

    useEffect(() => {
        if (isDirty) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
    }, [isDirty]);

    // Pre populate information for segment update
    function handleUpdate(data: CaseStudyFromType) {
        updateCaseStudy(data, props.caseStudy.id).catch((err) =>
            console.log(err)
        );
    }

    function handleClose() {
        if (!unsavedChanges) {
            props.onClose();
            props.setSelectedCaseStudy(0);
        } else {
            onOpenChangeUnsavedChanges();
        }
    }

    return (
        <>
            <div className="xl:px-10">
                <div className="w-full mb-4 text-center text-3xl font-bold text-orange-600">
                    {props.caseStudy.title}
                </div>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="flex justify-between mt-4 xl:mt-0">
                        <div className="flex gap-4">
                            <div
                                className={`${
                                    props.caseStudy.published
                                        ? "text-green-600"
                                        : "text-red-400"
                                } font-bold text-xl mb-4`}>
                                {props.caseStudy.published ? "LIVE" : "DRAFT"}
                            </div>
                            {unsavedChanges && (
                                <div className="my-auto text-xl font-bold text-red-400 fade-in mb-4">
                                    There are unsaved changes
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            {unsavedChanges && (
                                <div className="fade-in flex">
                                    <div>
                                        <button
                                            type="button"
                                            onClick={resetCaseStudyForm}
                                            className="xl:px-4 xl:py-2 px-2 py-1 text-sm xl:text-base text-orange-600 hover:text-red-400 rounded">
                                            Discard
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="xl:px-4 xl:py-2 px-2 py-1 text-sm xl:text-base bg-orange-600 rounded">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        updateCaseStudyPublished(
                                            props.caseStudy.id,
                                            !props.caseStudy.published
                                        ).catch((err) => console.log(err));
                                    }}
                                    className={`${
                                        props.caseStudy.published
                                            ? "bg-red-400 "
                                            : "bg-green-600"
                                    } xl:px-4 xl:py-2 px-2 py-1 text-sm xl:text-base rounded`}>
                                    {props.caseStudy.published
                                        ? "UNPUBLISH"
                                        : "PUBLISH"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid xl:grid-cols-2 gap-10">
                        <div id="left">
                            <div className="min-h-[33%]">
                                <div className="font-bold text-2xl pb-2 mb-2 border-b border-neutral-400">
                                    Images:
                                </div>
                                <div className="grid xl:grid-cols-3 grid-cols-2 gap-4 p-2">
                                    {imageFields.map(
                                        (
                                            image: CaseStudyImageType,
                                            index: number
                                        ) => {
                                            return (
                                                <div
                                                    key={
                                                        image.url + "-" + index
                                                    }
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
                                            onOpenChangeImageSelect();
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
                            <div className="h-1/3 flex justify-between gap-2">
                                <div className="basis-1/2">
                                    <div className="font-bold text-2xl pb-2 mb-2 border-b border-neutral-400">
                                        Video:
                                    </div>
                                    {getValues("video") ? (
                                        <>
                                            <div
                                                onClick={() => {
                                                    setPreviewVideo(
                                                        getValues("video")
                                                    );
                                                    onOpenChangeVideoPreview();
                                                }}
                                                className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4">
                                                <Image
                                                    height={100}
                                                    width={100}
                                                    src={"/images/play.png"}
                                                    alt="play"
                                                    className="w-full h-auto m-auto"
                                                />
                                            </div>
                                            <div className="text-center">
                                                {
                                                    getValues("video").split(
                                                        "-"
                                                    )[0]
                                                }
                                            </div>
                                            <div className="text-center mt-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onOpenVideoSelect();
                                                    }}
                                                    className="px-10 py-2 bg-orange-600 rounded m-auto">
                                                    Change
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-center mt-4">
                                                None Selected
                                            </div>
                                            <div className="text-center mt-2 h-full">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onOpenVideoSelect();
                                                    }}
                                                    className="px-10 py-2 bg-orange-600 rounded m-auto">
                                                    Select
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="basis-1/2">
                                    <div className="font-bold text-2xl pb-2 mb-2 border-b border-neutral-400">
                                        Thumbnail:
                                    </div>
                                    <div className="grid grid-cols-1">
                                        {thumbnailImage ? (
                                            <div className="relative">
                                                <Image
                                                    height={300}
                                                    width={200}
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                        thumbnailImage
                                                    }
                                                    alt={thumbnailImage}
                                                    className="w-full h-auto"
                                                />
                                                <div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                                    <div className="text-red-400 h-full flex justify-center">
                                                        <i
                                                            onClick={() => {
                                                                setValue(
                                                                    "videoThumbnail",
                                                                    "",
                                                                    {
                                                                        shouldDirty:
                                                                            true,
                                                                    }
                                                                );
                                                                setThumbnailImage(
                                                                    ""
                                                                );
                                                            }}
                                                            aria-hidden
                                                            className="m-auto fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    onOpenChangeThumbnailSelect();
                                                }}
                                                className="min-h-28 cursor-pointer w-full h-full bg-black hover:bg-opacity-25 transition-all bg-opacity-75 top-0 left-0">
                                                <div className="flex h-full justify-center">
                                                    <i
                                                        aria-hidden
                                                        className="m-auto fa-solid fa-plus fa-2xl"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="right">
                            <div className="font-bold text-2xl">Title:</div>
                            <input
                                type="text"
                                {...register("title", {
                                    required: {
                                        value: true,
                                        message: "Title is requited.",
                                    },
                                })}
                                placeholder={
                                    errors.title
                                        ? errors.title.message
                                        : "Title"
                                }
                                className={
                                    errors.title
                                        ? "placeholder:text-red-400"
                                        : ""
                                }
                            />
                            <div className="font-bold text-2xl mt-2">
                                Date/Location:
                            </div>
                            <input type="text" {...register("dateLocation")} />
                            <div>
                                <div className="flex gap-4 w-full mt-2">
                                    <div className="font-bold text-2xl">
                                        Detail:
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
                                    <div className="min-h-80">
                                        <Markdown>{getValues("copy")}</Markdown>
                                    </div>
                                ) : (
                                    <textarea
                                        {...register("copy", {
                                            required: {
                                                value: true,
                                                message: "Details is required.",
                                            },
                                        })}
                                        placeholder={
                                            errors.copy
                                                ? errors.copy.message
                                                : "Details..."
                                        }
                                        className={`${
                                            errors.copy
                                                ? "placeholder:text-red-400"
                                                : ""
                                        } h-80`}
                                    />
                                )}
                            </div>
                            <div className="flex justify-between mt-5">
                                <div className="font-bold text-2xl mt-auto">
                                    Tags:
                                </div>
                                <em className="my-auto text-neutral-600">
                                    Click a tag to remove it
                                </em>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2">
                                {tagsFields.map(
                                    (tag: CaseStudyTagType, index: number) => {
                                        return (
                                            <Chip
                                                onClick={() =>
                                                    tagsRemove(index)
                                                }
                                                className="cursor-pointer"
                                                key={tag.text + "-" + index}>
                                                {tag.text}
                                            </Chip>
                                        );
                                    }
                                )}
                            </div>
                            <div className="font-bold text-2xl mt-5">
                                New Tag:
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Add a new Tag"
                                    value={newTag}
                                    onChange={(e) => {
                                        setNewTag(e.target.value);
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newTag !== "") {
                                            tagsAppend({ text: newTag });
                                            setNewTag("");
                                        }
                                    }}
                                    className="my-auto px-4 py-2 bg-orange-600 rounded">
                                    Add
                                </button>
                            </div>
                            <div className="font-bold text-2xl mt-5">
                                Order:
                            </div>
                            <div className="w-1/4">
                                <input type="number" {...register("order")} />
                            </div>
                        </div>
                        <div></div>
                    </div>
                </form>

                {/* Change video modal */}
                <ChangeVideoModal
                    videos={props.videos}
                    isOpenSelectVideo={isOpenVideoSelect}
                    onOpenChangeSelectVideo={onOpenChangeVideoSelect}
                    onOpenChangePreviewVideo={onOpenChangeVideoSelect}
                    setValue={setValue}
                    hasVideoSet={getValues("video") !== "" ? true : false}
                    modalTarget="video"
                    modalTitle="Case Study Video"
                    prefixCheck="VIDEO"
                />

                {/* Preview video modal */}
                <PreviewVideoModal
                    isOpenPreviewVideo={isOpenVideoPreview}
                    onOpenChangePreviewVideo={onOpenChangeVideoPreview}
                    previewVideo={previewVideo}
                />

                {/* Change image modal */}
                <SegmentImagesModal
                    isOpenAddImage={isOpenImageSelect}
                    onOpenChangeAddImage={onOpenChangeImageSelect}
                    images={props.images}
                    imageAppend={imageAppend}
                    prefixCheck="study"
                />

                {/* Change thumbnail modal */}
                <CaseStudyThumbnailModal
                    isOpenThumbnailSelect={isOpenThumbnailSelect}
                    onOpenChangeThumbnailSelect={onOpenChangeThumbnailSelect}
                    setValue={setValue}
                    images={props.images}
                    setThumbnailImage={setThumbnailImage}
                />

                {/* Delete warning modal */}
                <Modal
                    size="2xl"
                    isDismissable={false}
                    hideCloseButton
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
                                    <div className="font-bold text-2xl text-center">
                                        {"Delete " +
                                            props.caseStudy.title +
                                            "?"}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        className="rounded-md"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            deleteCaseStudy(props.caseStudy.id)
                                                .then(() => {
                                                    onClose();
                                                    props.setSelectedCaseStudy(
                                                        0
                                                    );
                                                    props.onClose();
                                                })
                                                .catch((err) =>
                                                    console.log(err)
                                                );
                                        }}>
                                        Delete
                                    </Button>
                                    <Button
                                        className="rounded-md"
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

                {/* Unsaved Changes modal */}
                <Modal
                    size="2xl"
                    isDismissable={false}
                    hideCloseButton
                    backdrop="blur"
                    isOpen={isOpenUnsavedChanges}
                    className="dark"
                    scrollBehavior="inside"
                    onOpenChange={onOpenChangeUnsavedChanges}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold text-red-400">
                                        Unsaved Changes
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    <div className="font-bold text-2xl text-center">
                                        There are unsaved changes on this Case
                                        Study.
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        className="rounded-md"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            onClose();
                                            props.setSelectedCaseStudy(0);
                                            props.onClose();
                                        }}>
                                        Discard
                                    </Button>
                                    <Button
                                        className="rounded-md"
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
            </div>
            <ModalFooter>
                <Button
                    className="rounded-md"
                    onClick={() => onOpenChangeDelete()}
                    variant="light"
                    color="danger">
                    Delete Case Study
                </Button>
                <Button
                    className="rounded-md"
                    color="danger"
                    onPress={handleClose}>
                    Close
                </Button>
            </ModalFooter>
        </>
    );
}
