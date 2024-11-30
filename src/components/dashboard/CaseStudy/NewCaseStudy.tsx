// Library Components
import {
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
import { Images, Videos } from "@prisma/client";
import Image from "next/image";
import { useFieldArray, useForm } from "react-hook-form";
import { createCaseStudy } from "@/server/caseStudyActions/createCaseStudy";
import {
    CaseStudyImageType,
    CaseStudyTagType,
    CaseStudyFromType,
} from "@/lib/types";

// Context imports
import { DashboardStateContext } from "../DashboardStateProvider";
import ChangeVideoModal from "../Pages/Modals/ChangeVideoModal";
import PreviewVideoModal from "../Pages/Modals/PreviewVideoModal";
import SegmentImagesModal from "../Segments/SegmentImagesModal";
import CaseStudyThumbnailModal from "./CaseStudyThumbnailModal";
export default function NewCaseStudy(props: {
    segmentId: number;
    studyCount: number;
    videos: Videos[];
    images: Images[];
}) {
    const newCaseStudyForm = useForm<CaseStudyFromType>({
        defaultValues: {
            title: "",
            dateLocation: "",
            copy: "",
            image: [],
            video: "",
            videoThumbnail: "",
            segmentId: props.segmentId,
            tags: [],
            order: props.studyCount + 1,
            published: false,
        },
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: { isDirty, errors, dirtyFields },
    } = newCaseStudyForm;

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

    // New Tag State
    const [newTag, setNewTag] = useState("");

    // State for preview description text
    const [previewText, setPreviewText] = useState(false);
    // State for if there are unsaved changes
    const [isValid, setIsValid] = useState(false);

    // Submit success state
    const [success, setSuccess] = useState(false);

    // Context state imports
    const { previewVideo, setPreviewVideo } = useContext(DashboardStateContext);

    const [thumbnailImage, setThumbnailImage] = useState("");

    // Image select modal declaration
    const { isOpen: isOpenImageSelect, onOpenChange: onOpenChangeImageSelect } =
        useDisclosure();

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

    // Image preview modal declaration
    const {
        isOpen: isOpenThumbnailSelect,
        onOpenChange: onOpenChangeThumbnailSelect,
    } = useDisclosure();

    // Constant check for unsaved changes
    useEffect(() => {
        if (dirtyFields.copy && dirtyFields.title && dirtyFields.image) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [dirtyFields.title, dirtyFields.copy, dirtyFields.image]);

    // Update segment with pre populated data
    async function addCaseStudy(data: CaseStudyFromType) {
        createCaseStudy(data)
            .then(() => {
                setSuccess(true);
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="xl:px-10">
            {success ? (
                <>
                    <div className="text-center text-green-400 font-bold text-3xl mb-4">
                        Success!
                    </div>
                    <div className="text-center text-xl">Case study added.</div>
                    <div className="text-center text-base">
                        Don&apos;t forget to publish it.
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit(addCaseStudy)}>
                    {isValid && (
                        <div className="flex justify-between">
                            <div className="my-auto text-sm xl:text-xl font-bold text-red-400 fade-in mb-4">
                                Case Study can be saved
                            </div>
                            <button
                                type="submit"
                                className="my-auto bg-orange-600 xl:px-4 xl:py-2 px-2 py-1 rounded">
                                Submit
                            </button>
                        </div>
                    )}
                    <div className="grid xl:grid-cols-2 gap-4">
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
                                                                .NEXT_PUBLIC_CDN +
                                                            "/images/" +
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
                                        {getValues("videoThumbnail") ? (
                                            <div className="relative">
                                                <Image
                                                    height={300}
                                                    width={200}
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_CDN +
                                                        "/images/" +
                                                        getValues(
                                                            "videoThumbnail"
                                                        )
                                                    }
                                                    alt={getValues(
                                                        "videoThumbnail"
                                                    )}
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
                                        message: "Title is required.",
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
                            <input
                                type="text"
                                {...register("dateLocation")}
                                placeholder="Date/Location"
                            />
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
                                                message: "Detail is required.",
                                            },
                                        })}
                                        placeholder={
                                            errors.copy
                                                ? errors.copy.message
                                                : "Detail"
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
                    </div>
                </form>
            )}

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
        </div>
    );
}
