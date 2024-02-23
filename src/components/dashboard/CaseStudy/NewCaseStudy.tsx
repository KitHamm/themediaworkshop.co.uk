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
    Chip,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import Markdown from "react-markdown";

// React Components
import { useState, useEffect } from "react";

// Types
import { CaseStudy, Images, Videos } from "@prisma/client";
import Image from "next/image";
import uploadHandler from "../uploadHandler";

export default function NewCaseStudy(props: {
    revalidateDashboard: any;
    segmentId: number;
}) {
    // States for initial case study content
    const [title, setTitle] = useState("");
    const [dateLocation, setDateLocation] = useState("");
    const [copy, setCopy] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [video, setVideo] = useState<string>("");
    const [videoThumbnail, setVideoThumbnail] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [order, setOrder] = useState(0);
    // New Tag State
    const [newTag, setNewTag] = useState("");

    // States for preview media
    const [selectedPreviewVideo, setSelectedPreviewVideo] = useState("");

    // States for image and video pools
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [availableVideos, setAvailableVideos] = useState<string[]>([]);

    // State for preview description text
    const [previewText, setPreviewText] = useState(false);
    // State for if there are unsaved changes
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    // Submit success state
    const [success, setSuccess] = useState(false);

    // States for naming errors of uploads
    const [imageNamingError, setImageNamingError] = useState(false);
    const [videoNamingError, setVideoNamingError] = useState(false);
    const [notVideoError, setNotVideoError] = useState(false);
    const [notImageError, setNotImageError] = useState(false);

    // Uploading State
    const [uploading, setUploading] = useState(false);

    // Image select modal declaration
    const {
        isOpen: isOpenImageSelect,
        onOpen: onOpenImageSelect,
        onOpenChange: onOpenChangeImageSelect,
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
        onOpen: onOpenVideoPreview,
        onOpenChange: onOpenChangeVideoPreview,
    } = useDisclosure();

    // Image preview modal declaration
    const {
        isOpen: isOpenThumbnailSelect,
        onOpen: onOpenThumbnailSelect,
        onOpenChange: onOpenChangeThumbnailSelect,
    } = useDisclosure();

    // Constant check for unsaved changes
    useEffect(() => {
        if (title !== "" && copy !== "" && images.length > 0) {
            setUnsavedChanges(true);
        } else {
            setUnsavedChanges(false);
        }
    }, [
        title,
        copy,
        JSON.stringify(images),
        video,
        JSON.stringify(tags),
        order,
    ]);

    // Check naming conventions for uploads
    function namingConventionCheck(fileName: string, check: string) {
        if (fileName.split("_")[0] !== check) {
            return false;
        } else {
            return true;
        }
    }

    async function getImages() {
        fetch("/api/images", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setAvailableImages(json))
            .catch((err) => console.log(err));
    }

    async function getVideos() {
        fetch("/api/videos", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setAvailableVideos(json))
            .catch((err) => console.log(err));
    }

    function removeImage(index: number) {
        setImages(
            images.filter((_image: string, _index: number) => _index !== index)
        );
    }

    function removeTag(index: number) {
        setTags(
            tags.filter((_tag: string, _index: number) => _index !== index)
        );
    }

    function clearFileInput(target: string) {
        const inputElm = document.getElementById(
            "new-case-study-" + target + "-upload"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    // Pre populate information for segment update
    function handleUpdate() {
        const json = JSON.stringify({
            title: title,
            copy: copy,
            image: images,
            video: video,
            tags: tags,
            order: order,
            videoThumbnail: videoThumbnail,
            segment: { connect: { id: props.segmentId } },
        });
        addCaseStudy(json);
    }
    // Update segment with pre populated data
    async function addCaseStudy(json: any) {
        await fetch("/api/addcasestudy", {
            method: "POST",
            body: json,
        })
            .then((response) => {
                if (response.ok) {
                    setSuccess(true);
                    setTitle("");
                    setCopy("");
                    setImages([]);
                    setVideo("");
                    setTags([]);
                    setOrder(0);
                    props.revalidateDashboard("/");
                }
            })
            .catch((error) => console.log(error));
    }

    async function uploadImage(file: File, target: string) {
        if (file.type.split("/")[0] !== "image") {
            setNotImageError(true);
            setUploading(false);
            return;
        } else {
            await uploadHandler(file, "image")
                .then((res: any) => {
                    if (res.message) {
                        setUploading(false);
                        getImages();
                        clearFileInput("image");
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    async function uploadVideo(file: File, target: string) {
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
                        clearFileInput("video");
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <div className="xl:px-10">
            {success ? (
                <>
                    <div className="text-center font-bold text-3xl mb-4">
                        Success!
                    </div>
                    <div className="text-center text-xl">Case study added</div>
                </>
            ) : (
                <>
                    {unsavedChanges && (
                        <div className="flex justify-between">
                            <div className="my-auto text-sm xl:text-xl font-bold text-red-400 fade-in mb-4">
                                Case Study can be saved
                            </div>
                            <button
                                onClick={handleUpdate}
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
                                    {images.map(
                                        (image: string, index: number) => {
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
                                                            image
                                                        }
                                                        alt={image}
                                                        className="w-full h-auto"
                                                    />
                                                    <div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                                        <div className="text-red-400 h-full flex justify-center">
                                                            <i
                                                                onClick={() =>
                                                                    removeImage(
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
                                            getImages();
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
                                    {video !== "" ? (
                                        <>
                                            <div
                                                onClick={() => {
                                                    setSelectedPreviewVideo(
                                                        video
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
                                                {video.split("-")[0]}
                                            </div>
                                            <div className="text-center mt-2 mt-2">
                                                <button
                                                    onClick={() => {
                                                        onOpenVideoSelect();
                                                        getVideos();
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
                                                    onClick={() => {
                                                        onOpenVideoSelect();
                                                        getVideos();
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
                                        {videoThumbnail !== "" ? (
                                            <div className="relative">
                                                <Image
                                                    height={300}
                                                    width={200}
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                        videoThumbnail
                                                    }
                                                    alt={videoThumbnail}
                                                    className="w-full h-auto"
                                                />
                                                <div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
                                                    <div className="text-red-400 h-full flex justify-center">
                                                        <i
                                                            onClick={() =>
                                                                setVideoThumbnail(
                                                                    ""
                                                                )
                                                            }
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
                                                    getImages();
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
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                            />
                            <div className="font-bold text-2xl mt-2">
                                Date/Location:
                            </div>
                            <input
                                type="text"
                                value={dateLocation}
                                onChange={(e) => {
                                    setDateLocation(e.target.value);
                                }}
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
                                        onClick={() =>
                                            setPreviewText(!previewText)
                                        }
                                        className="text-orange-600 cursor-pointer">
                                        {previewText ? "Edit" : "Preview"}
                                    </button>
                                </div>
                                {previewText ? (
                                    <div className="min-h-80">
                                        <Markdown>{copy}</Markdown>
                                    </div>
                                ) : (
                                    <textarea
                                        className="h-80"
                                        value={copy}
                                        onChange={(e) => {
                                            setCopy(e.target.value);
                                        }}
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
                                {tags.map((tag: string, index: number) => {
                                    return (
                                        <Chip
                                            onClick={() => removeTag(index)}
                                            className="cursor-pointer"
                                            key={tag + "-" + index}>
                                            {tag}
                                        </Chip>
                                    );
                                })}
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
                                    onClick={() => {
                                        if (newTag !== "") {
                                            setTags([...tags, newTag]);
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
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={!Number.isNaN(order) ? order : ""}
                                    onChange={(e) => {
                                        setOrder(parseInt(e.target.value));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Change video modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenVideoSelect}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeVideoSelect}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Video
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {notVideoError && (
                                    <div className="w-full text-center text-red-400">
                                        Please Upload file in video format.
                                    </div>
                                )}
                                {videoNamingError && (
                                    <div className="w-full text-center text-red-400">
                                        File name should be prefixed with STUDY_
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
                                                            namingConventionCheck(
                                                                e.target
                                                                    .files[0]
                                                                    .name,
                                                                "STUDY"
                                                            )
                                                        ) {
                                                            setUploading(true);
                                                            setVideoNamingError(
                                                                false
                                                            );
                                                            uploadVideo(
                                                                e.target
                                                                    .files[0],
                                                                "video"
                                                            );
                                                        } else {
                                                            setVideoNamingError(
                                                                true
                                                            );
                                                            e.target.value = "";
                                                        }
                                                    }
                                                }}
                                                id={
                                                    "new-case-study-video-upload"
                                                }
                                                type="file"
                                                className="inputFile"
                                            />
                                            <label
                                                htmlFor={
                                                    "new-case-study-video-upload"
                                                }>
                                                Upload New
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                                    {availableVideos.map(
                                        (video: Videos, index: number) => {
                                            if (
                                                video.name.split("_")[0] ===
                                                "STUDY"
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
                                                                setSelectedPreviewVideo(
                                                                    video.name
                                                                );
                                                                onOpenChangeVideoPreview();
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
                                                                    setVideo(
                                                                        video.name
                                                                    );
                                                                    onClose();
                                                                    setVideoNamingError(
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
                                {video ? (
                                    <button
                                        onClick={() => {
                                            setVideo("");
                                            onClose();
                                            setNotVideoError(false);
                                            setVideoNamingError(false);
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
                                        setVideoNamingError(false);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Change image modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenImageSelect}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeImageSelect}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold">
                                    Select or Upload Image
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {imageNamingError && (
                                    <div className="text-center text-red-400">
                                        File name prefix should be STUDY_
                                    </div>
                                )}
                                <div className="w-full flex justify-center mb-10">
                                    {uploading ? (
                                        <CircularProgress
                                            color="warning"
                                            aria-label="Loading..."
                                        />
                                    ) : (
                                        <>
                                            <div className="file-input shadow-xl">
                                                <input
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            if (
                                                                namingConventionCheck(
                                                                    e.target
                                                                        .files[0]
                                                                        .name,
                                                                    "STUDY"
                                                                )
                                                            ) {
                                                                setUploading(
                                                                    true
                                                                );
                                                                setImageNamingError(
                                                                    false
                                                                );
                                                                uploadImage(
                                                                    e.target
                                                                        .files[0],
                                                                    "video"
                                                                );
                                                            } else {
                                                                setImageNamingError(
                                                                    true
                                                                );
                                                                e.target.value =
                                                                    "";
                                                            }
                                                        }
                                                    }}
                                                    id={
                                                        "new-case-study-image-upload"
                                                    }
                                                    type="file"
                                                    className="inputFile"
                                                />
                                                <label
                                                    htmlFor={
                                                        "new-case-study-image-upload"
                                                    }>
                                                    Upload New
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
                                    {availableImages.map(
                                        (image: Images, index: number) => {
                                            if (
                                                image.name.split("_")[0] ===
                                                "STUDY"
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
                                                            setImages([
                                                                ...images,
                                                                image.name,
                                                            ]);
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
            {/* Change thumbnail modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenThumbnailSelect}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeThumbnailSelect}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold">
                                    Select or Upload Image
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {imageNamingError && (
                                    <div className="text-center text-red-400">
                                        File name prefix should be THUMBNAIL_
                                    </div>
                                )}
                                <div className="w-full flex justify-center mb-10">
                                    {uploading ? (
                                        <CircularProgress
                                            color="warning"
                                            aria-label="Loading..."
                                        />
                                    ) : (
                                        <>
                                            <div className="file-input shadow-xl">
                                                <input
                                                    onChange={(e) => {
                                                        if (e.target.files) {
                                                            if (
                                                                namingConventionCheck(
                                                                    e.target
                                                                        .files[0]
                                                                        .name,
                                                                    "THUMBNAIL"
                                                                )
                                                            ) {
                                                                setUploading(
                                                                    true
                                                                );
                                                                setImageNamingError(
                                                                    false
                                                                );
                                                                uploadImage(
                                                                    e.target
                                                                        .files[0],
                                                                    "video"
                                                                );
                                                            } else {
                                                                setImageNamingError(
                                                                    true
                                                                );
                                                                e.target.value =
                                                                    "";
                                                            }
                                                        }
                                                    }}
                                                    id={
                                                        "new-case-study-image-upload"
                                                    }
                                                    type="file"
                                                    className="inputFile"
                                                />
                                                <label
                                                    htmlFor={
                                                        "new-case-study-image-upload"
                                                    }>
                                                    Upload New
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="grid xl:grid-cols-4 grid-cols-2 gap-5">
                                    {availableImages.map(
                                        (image: Images, index: number) => {
                                            if (
                                                image.name.split("_")[0] ===
                                                "THUMBNAIL"
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
                                                            setVideoThumbnail(
                                                                image.name
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
            {/* Preview Video Modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenVideoPreview}
                className="dark"
                scrollBehavior="inside"
                isDismissable={false}
                onOpenChange={onOpenChangeVideoPreview}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    {selectedPreviewVideo}
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
                                        selectedPreviewVideo
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
                                        setVideoNamingError(false);
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
