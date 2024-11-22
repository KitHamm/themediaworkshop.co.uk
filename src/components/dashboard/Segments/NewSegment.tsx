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
import Markdown from "react-markdown";
import { useFieldArray, useForm } from "react-hook-form";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";

// Types
import { Images, toLink } from "@prisma/client";
import { ImageFormType, SegmentFormType } from "@/lib/types";

// Functions
import axios from "axios";
import { createSegment } from "@/components/server/segmentActions/createSegment";
import TopImageSelectModal from "./TopImageSelectModal";

export default function NewSegment(props: {
    title: string;
    pageID: number;
    images: Images[];
    segmentCount: number;
}) {
    const newSegmentForm = useForm<SegmentFormType>({
        defaultValues: {
            title: "",
            copy: "",
            image: [],
            video: [],
            headerImage: "",
            order: props.segmentCount + 1,
            buttonText: "",
            linkTo: toLink.NONE,
        },
    });
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isDirty },
        control,
        getValues,
        setValue,
    } = newSegmentForm;

    const {
        fields: imageFields,
        append: imageAppend,
        remove: imageRemove,
    } = useFieldArray({
        control: control,
        name: "image",
    });
    const {
        fields: videoFields,
        append: videoAppend,
        remove: videoRemove,
    } = useFieldArray({
        control: control,
        name: "video",
    });

    // State for images selected and header image for segment

    // State for naming convention errors on upload
    const [topImageNamingError, setTopImageNamingError] = useState(false);
    const [segmentImageNamingError, setSegmentImageNamingError] =
        useState(false);

    // State for description preview
    const [previewText, setPreviewText] = useState(false);
    // Uploading, not image error and success states
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notImageError, setNotImageError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [topImage, setTopImage] = useState("");
    // Top image select modal
    const { isOpen: isOpenTopImage, onOpenChange: onOpenChangeTopImage } =
        useDisclosure();
    // Segment images select modal
    const { isOpen: isOpenAddImage, onOpenChange: onOpenChangeAddImage } =
        useDisclosure();

    function clearFileInput(target: string) {
        var id = target === "header" ? "top-image-input" : "image-input";
        const inputElm = document.getElementById(id) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    // Check naming conventions for uploads
    function namingConventionCheck(fileName: string, check: string) {
        if (fileName.split("_")[0] !== check) {
            return false;
        } else {
            return true;
        }
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

    function addSegment(data: SegmentFormType) {
        createSegment(data, props.pageID)
            .then(() => {
                setSuccess(true);
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            {success ? (
                <div className="w-full text-center">
                    <div className="font-bold text-3xl">Success!</div>
                </div>
            ) : (
                <div className="light rounded-md xl:px-5 mb-4 py-4">
                    <form onSubmit={handleSubmit(addSegment)}>
                        <div className="flex justify-between border-b pb-2">
                            <div className="">Top Image</div>
                        </div>
                        <div className="relative my-2">
                            {topImage ? (
                                <div>
                                    <Image
                                        height={2000}
                                        width={1000}
                                        src={
                                            process.env
                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                            topImage
                                        }
                                        alt={topImage}
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
                                                    onClick={() => {
                                                        setValue(
                                                            "headerImage",
                                                            "",
                                                            {
                                                                shouldDirty:
                                                                    true,
                                                            }
                                                        );
                                                        setTopImage("");
                                                    }}
                                                    aria-hidden
                                                    className="fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full  my-10">
                                    {uploading ? (
                                        <CircularProgress
                                            classNames={{
                                                svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                                value: "text-xl",
                                            }}
                                            className="m-auto"
                                            showValueLabel={true}
                                            value={uploadProgress}
                                            color="warning"
                                            aria-label="Loading..."
                                        />
                                    ) : (
                                        <div className="flex justify-center">
                                            <div className="text-center">
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
                        <div className="xl:grid xl:grid-cols-2 xl:gap-10 ">
                            <div id={"left-segment-column"}>
                                <div>
                                    <div className="border-b pb-2 mb-2">
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
                                <div>
                                    <div className="flex gap-4 w-full border-b pb-2 mb-2">
                                        <div>Description</div>
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
                                                        The text is rendered
                                                        using Markdown. This
                                                        means that you can add
                                                        headers, links, and line
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
                                            onClick={() =>
                                                setPreviewText(!previewText)
                                            }
                                            className="text-orange-600 cursor-pointer">
                                            {previewText ? "Edit" : "Preview"}
                                        </button>
                                    </div>
                                    {previewText ? (
                                        <div className="min-h-52">
                                            <Markdown>
                                                {getValues("copy")}
                                            </Markdown>
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
                                <div>
                                    <div className="border-b pb-2 mb-2">
                                        Order
                                    </div>
                                    <div className="xl:w-1/6 w-1/2">
                                        <input
                                            {...register("order")}
                                            className="text-black"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={"right-segment-column"}>
                                <div className="">
                                    <div className="border-b pb-2">Images</div>
                                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-4 p-2">
                                        {imageFields.map(
                                            (
                                                image: ImageFormType,
                                                index: number
                                            ) => {
                                                return (
                                                    <div
                                                        key={
                                                            image + "-" + index
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
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="disabled:bg-neutral-400 px-4 py-2 bg-orange-600 rounded text-white">
                                Submit
                            </Button>
                        </div>
                    </form>
                    {/* Top Image modal */}
                    <TopImageSelectModal
                        isOpenTopImage={isOpenTopImage}
                        onOpenChangeTopImage={onOpenChangeTopImage}
                        segmentTitle={"New Segment"}
                        images={props.images}
                        setValue={setValue}
                        setTopImage={setTopImage}
                    />
                    {/* <Modal
                        size="5xl"
                        backdrop="blur"
                        isOpen={isOpenTopImage}
                        className="dark"
                        scrollBehavior="inside"
                        onOpenChange={onOpenChangeTopImage}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader>{"Top Image"}</ModalHeader>
                                    <ModalBody>
                                        <div className="grid xl:grid-cols-4 grid-cols-1 gap-5">
                                            {props.images
                                                .filter(function (
                                                    image: Images
                                                ) {
                                                    return (
                                                        image.name.split(
                                                            "_"
                                                        )[0] === "SEGHEAD"
                                                    );
                                                })
                                                .map(
                                                    (
                                                        image: Images,
                                                        index: number
                                                    ) => {
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
                                                                        process
                                                                            .env
                                                                            .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                        image.name
                                                                    }
                                                                    alt={
                                                                        image.name
                                                                    }
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
                    </Modal> */}
                    {/* Segment images modal */}
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
                                                File name should be prefix with
                                                SEGMENT_
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
                                                                    setUploading(
                                                                        true
                                                                    );
                                                                    setSegmentImageNamingError(
                                                                        false
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
                                                                        "segment"
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        id={"image-input"}
                                                        type="file"
                                                        className="inputFile"
                                                    />
                                                    <label
                                                        htmlFor={"image-input"}>
                                                        Upload New
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
                                            {props.images
                                                .filter(function (
                                                    image: Images
                                                ) {
                                                    return (
                                                        image.name.split(
                                                            "_"
                                                        )[0] === "SEGMENT"
                                                    );
                                                })
                                                .map(
                                                    (
                                                        image: Images,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    image.name +
                                                                    "-" +
                                                                    index
                                                                }
                                                                className="flex cursor-pointer"
                                                                onClick={() => {
                                                                    imageAppend(
                                                                        {
                                                                            url: image.name,
                                                                        }
                                                                    );
                                                                    onClose();
                                                                }}>
                                                                <Image
                                                                    height={300}
                                                                    width={300}
                                                                    src={
                                                                        process
                                                                            .env
                                                                            .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                        image.name
                                                                    }
                                                                    alt={
                                                                        image.name
                                                                    }
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
                </div>
            )}
        </>
    );
}
