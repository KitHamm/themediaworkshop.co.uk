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
    Tooltip,
    Pagination,
    Select,
    SelectItem,
} from "@nextui-org/react";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Types
import { Images, Logos, Videos } from "@prisma/client";

// Functions
import Link from "next/link";
import axios from "axios";
import {
    deleteFile as deleteFileSA,
    errorResponse,
} from "../server/mediaActions/deleteFile";
import { revalidateDashboard } from "../server/revalidateDashboard";
import { FilePrefixList } from "@/lib/constants";
import { imageSort, itemOrder, videoSort } from "@/lib/functions";

export default function Media(props: {
    session: any;
    images: Images[];
    logos: Logos[];
    videos: Videos[];
}) {
    // Search Param state to set which videos or images to view
    const searchParams = useSearchParams();
    const videoView: string = searchParams.get("video")
        ? searchParams.get("video")!
        : "background";
    const imageView: string = searchParams.get("image")
        ? searchParams.get("image")!
        : "header";

    // Image Collection
    const [selectedImages, setSelectedImages] = useState<Images[]>(
        imageSort(props.images, props.logos, "header")
    );
    const [selectedVideos, setSelectedVideos] = useState<Videos[]>(
        videoSort(props.videos, "background")
    );

    // Pagination Controls
    const [videoPage, setVideoPage] = useState(1);
    const [imagePage, setImagePage] = useState(1);
    const [imagesPerPage, setImagesPerPage] = useState(8);
    const [videosPerPage, setVideosPerPage] = useState(8);
    const [sortVideosBy, setSortVideosBy] = useState("date");
    const [orderVideos, setOrderVideos] = useState("desc");
    const [sortImagesBy, setSortImagesBy] = useState("date");
    const [orderImages, setOrderImages] = useState("desc");

    useEffect(() => {
        setSelectedImages(imageSort(props.images, props.logos, imageView));
        setImagePage(1);
    }, [props.images, imageView]);

    useEffect(() => {
        setSelectedVideos(
            itemOrder(
                videoSort(props.videos, videoView),
                sortVideosBy,
                orderVideos
            )
        );
        setVideoPage(1);
    }, [props.videos, videoView]);

    useEffect(() => {
        setVideoPage(1);
    }, [videosPerPage]);

    useEffect(() => {
        setImagePage(1);
    }, [imagesPerPage]);

    useEffect(() => {
        setSelectedVideos(itemOrder(selectedVideos, sortVideosBy, orderVideos));
    }, [sortVideosBy, orderVideos]);

    useEffect(() => {
        const temp = [...selectedImages];
        switch (sortImagesBy) {
            case "date":
                if (orderImages === "desc") {
                    temp.sort(
                        (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                    );
                    setSelectedImages(temp);
                } else {
                    temp.sort(
                        (a, b) =>
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                    );
                    setSelectedImages(temp);
                }
                break;
            case "name":
                if (orderImages === "desc") {
                    temp.sort((a, b) => b.name.localeCompare(a.name));
                    setSelectedImages(temp);
                } else {
                    temp.sort((a, b) => a.name.localeCompare(b.name));
                    setSelectedImages(temp);
                }
                break;
        }
    }, [sortImagesBy, orderImages]);

    // State for file to upload
    const [newUpload, setNewUpload] = useState<File>();

    // Is uploading state
    const [uploading, setUploading] = useState(false);

    // Selected Video and Image to view in modal
    const [selectedVideo, setSelectedVideo] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    // Error state for if the media upload has wrong naming convention
    const [namingError, setNamingError] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    // Delete state with file and file type
    const [toDelete, setToDelete] = useState({ file: "", type: "" });

    // Delete Errors
    const [deleteErrorArray, setDeleteErrorArray] = useState<errorResponse[]>(
        []
    );

    // Upload Progress State
    const [uploadProgress, setUploadProgress] = useState(0);

    // Image view modal declaration
    const {
        isOpen: isOpenImage,
        onOpen: onOpenImage,
        onOpenChange: onOpenChangeImage,
    } = useDisclosure();
    // Video view modal declaration
    const {
        isOpen: isOpenVideo,
        onOpen: onOpenVideo,
        onOpenChange: onOpenChangeVideo,
    } = useDisclosure();
    // Delete modal declaration
    const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
        useDisclosure();
    // Upload modal declaration
    const { isOpen: isOpenUpload, onOpenChange: onOpenChangeUpload } =
        useDisclosure();

    // Delete media depending on file type
    async function uploadMedia() {
        setUploadProgress(0);
        if (newUpload) {
            var type = newUpload.type.split("/")[0];
            const formData = new FormData();
            formData.append("file", newUpload);
            axios
                .post(("/api/" as string) + type, formData, {
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
                        clearFileInput();
                        onOpenChangeUpload();
                        revalidateDashboard();
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    async function deleteFile(type: string, file: string) {
        deleteFileSA(file, type)
            .then(() => {
                onOpenChangeDelete();
            })
            .catch((err) => {
                setDeleteErrorArray(JSON.parse(err.message));
            });
    }

    function clearFileInput() {
        const inputElm = document.getElementById(
            "new-video"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
        setNewUpload(undefined);
    }

    function onSelectFile(file: File) {
        const fileSize = file.size / 1024 / 1024;
        const filePrefix = file.name.split("_")[0];

        const nameCheck = FilePrefixList.includes(filePrefix);
        const sizeCheck = fileSize < 100;

        if (!nameCheck) {
            setNamingError(true);
        } else {
            setNamingError(false);
        }

        if (!sizeCheck) {
            setSizeError(true);
        } else {
            setSizeError(false);
        }

        if (nameCheck && sizeCheck) {
            setNewUpload(file);
        }
    }

    return (
        <div className={`xl:mx-20 mx-4 fade-in xl:pb-0 pb-20`}>
            <div className="xl:my-10 border-b py-4 mb-10 text-3xl font-bold capitalize">
                Media
            </div>
            <div className="my-6">
                <button
                    onClick={onOpenChangeUpload}
                    className="xl:px-10 xl:py-4 px-4 py-2 rounded bg-orange-600">
                    Upload Media
                </button>
            </div>
            <div className="xl:flex xl:grid-cols-2 grid-cols-1 xl:gap-10">
                <div className="xl:w-full">
                    <div className="flex justify-between border-b mb-5">
                        <div className="font-bold text-xl">Videos</div>
                        <i
                            onClick={() => revalidateDashboard()}
                            aria-hidden
                            className="cursor-pointer fa-solid fa-arrows-rotate"
                        />
                    </div>
                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-4 mb-4 text-center">
                        <Link
                            href={
                                `?view=media&video=background&image=` +
                                imageView
                            }
                            className={`${
                                videoView === "background"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Background
                        </Link>
                        <Link
                            href={`?view=media&video=video&image=` + imageView}
                            className={`${
                                videoView === "video"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Videos
                        </Link>
                    </div>
                    <div className="flex justify-evenly gap-12 mt-4">
                        <Select
                            className="dark ms-auto me-auto xl:me-0"
                            classNames={{
                                popoverContent: "bg-neutral-600",
                            }}
                            variant="bordered"
                            selectedKeys={[videosPerPage.toString()]}
                            labelPlacement="outside"
                            label={"Videos Per Page"}
                            onChange={(e) =>
                                setVideosPerPage(parseInt(e.target.value))
                            }>
                            <SelectItem className="dark" key={8} value={8}>
                                8
                            </SelectItem>
                            <SelectItem className="dark" key={12} value={12}>
                                12
                            </SelectItem>
                            <SelectItem className="dark" key={16} value={16}>
                                16
                            </SelectItem>
                            <SelectItem className="dark" key={20} value={20}>
                                20
                            </SelectItem>
                            <SelectItem
                                className="dark"
                                key={1000000}
                                value={1000000}>
                                All
                            </SelectItem>
                        </Select>
                        <Select
                            className="dark ms-auto me-auto xl:me-0"
                            classNames={{
                                popoverContent: "bg-neutral-600",
                            }}
                            variant="bordered"
                            selectedKeys={[sortVideosBy.toString()]}
                            labelPlacement="outside"
                            label={"Sort by"}
                            onChange={(e) => setSortVideosBy(e.target.value)}>
                            <SelectItem
                                className="dark"
                                key={"date"}
                                value={"date"}>
                                Date
                            </SelectItem>
                            <SelectItem
                                className="dark"
                                key={"name"}
                                value={"name"}>
                                Name
                            </SelectItem>
                        </Select>
                        <Select
                            className="dark ms-auto me-auto xl:me-0"
                            classNames={{
                                popoverContent: "bg-neutral-600",
                            }}
                            variant="bordered"
                            selectedKeys={[orderVideos.toString()]}
                            labelPlacement="outside"
                            label={"Order"}
                            onChange={(e) => setOrderVideos(e.target.value)}>
                            <SelectItem
                                className="dark"
                                key={"asc"}
                                value={"asc"}>
                                Ascending
                            </SelectItem>
                            <SelectItem
                                className="dark"
                                key={"desc"}
                                value={"desc"}>
                                Descending
                            </SelectItem>
                        </Select>
                    </div>
                    <div className="flex justify-center my-4">
                        <div className="flex justify-center">
                            <Pagination
                                className="dark mt-auto"
                                classNames={{
                                    cursor: "bg-orange-600",
                                }}
                                showControls
                                total={Math.ceil(
                                    selectedVideos.length / videosPerPage
                                )}
                                page={videoPage}
                                onChange={setVideoPage}
                            />
                        </div>
                    </div>
                    {/* Videos section */}
                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-4">
                        {selectedVideos.map((video: Videos, index: number) => {
                            if (
                                index >
                                    videoPage * videosPerPage -
                                        (videosPerPage + 1) &&
                                index < videoPage * videosPerPage
                            ) {
                                return (
                                    <Tooltip
                                        delay={1000}
                                        className="dark"
                                        placement="bottom"
                                        key={video.name + "-" + index}
                                        content={video.name}>
                                        <div className="flex flex-col border rounded border-neutral-800">
                                            <div
                                                onClick={() => {
                                                    setSelectedVideo(
                                                        video.name
                                                    );
                                                    onOpenVideo();
                                                }}
                                                className="cursor-pointer bg-neutral-600 bg-opacity-25 p-4 h-full flex w-full">
                                                <Image
                                                    height={100}
                                                    width={100}
                                                    src={"/images/play.png"}
                                                    alt="play"
                                                    className="xl:w-full h-auto m-auto"
                                                />
                                            </div>
                                            <div className="bg-neutral-800 bg-opacity-25">
                                                <div className="text-center truncate p-2 h-full">
                                                    {
                                                        video.name
                                                            .split("-")[0]
                                                            .split("_")[1]
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Tooltip>
                                );
                            }
                        })}
                    </div>
                </div>
                {/* Images section */}
                <div className="w-full">
                    <div className="flex justify-between border-b mb-5 xl:mt-0 mt-6">
                        <div className="font-bold text-xl">Images</div>
                        <i
                            onClick={() => revalidateDashboard()}
                            aria-hidden
                            className="cursor-pointer fa-solid fa-arrows-rotate"
                        />
                    </div>
                    <div className="grid xl:grid-cols-5 grid-cols-2 gap-4 mb-4 text-center">
                        <Link
                            href={
                                `?view=media&video=` +
                                videoView +
                                `&image=header`
                            }
                            className={`${
                                imageView === "header"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Header
                        </Link>
                        <Link
                            href={
                                `?view=media&video=` +
                                videoView +
                                `&image=segment`
                            }
                            className={`${
                                imageView === "segment"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Segment
                        </Link>
                        <Link
                            href={
                                `?view=media&video=` +
                                videoView +
                                `&image=study`
                            }
                            className={`${
                                imageView === "study"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Case Study
                        </Link>
                        <Link
                            href={
                                `?view=media&video=` +
                                videoView +
                                `&image=thumbnails`
                            }
                            className={`${
                                imageView === "thumbnails"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Thumbnails
                        </Link>
                        <Link
                            href={
                                `?view=media&video=` +
                                videoView +
                                `&image=logos`
                            }
                            className={`${
                                imageView === "logos"
                                    ? "bg-orange-600"
                                    : "bg-neutral-600"
                            } px-4 py-2 rounded transition-all`}>
                            Logos
                        </Link>
                    </div>
                    <div className="flex justify-evenly gap-12 mt-4">
                        <Select
                            className="dark ms-auto me-auto xl:me-0"
                            classNames={{
                                popoverContent: "bg-neutral-600",
                            }}
                            variant="bordered"
                            selectedKeys={[imagesPerPage.toString()]}
                            labelPlacement="outside"
                            label={"Images Per Page"}
                            onChange={(e) =>
                                setImagesPerPage(parseInt(e.target.value))
                            }>
                            <SelectItem className="dark" key={8} value={8}>
                                8
                            </SelectItem>
                            <SelectItem className="dark" key={12} value={12}>
                                12
                            </SelectItem>
                            <SelectItem className="dark" key={16} value={16}>
                                16
                            </SelectItem>
                            <SelectItem className="dark" key={20} value={20}>
                                20
                            </SelectItem>
                            <SelectItem
                                className="dark"
                                key={1000000}
                                value={1000000}>
                                All
                            </SelectItem>
                        </Select>
                        <Select
                            className="dark ms-auto me-auto xl:me-0"
                            classNames={{
                                popoverContent: "bg-neutral-600",
                            }}
                            variant="bordered"
                            selectedKeys={[sortImagesBy.toString()]}
                            labelPlacement="outside"
                            label={"Sort by"}
                            onChange={(e) => setSortImagesBy(e.target.value)}>
                            <SelectItem
                                className="dark"
                                key={"date"}
                                value={"date"}>
                                Date
                            </SelectItem>
                            <SelectItem
                                className="dark"
                                key={"name"}
                                value={"name"}>
                                Name
                            </SelectItem>
                        </Select>
                        <Select
                            className="dark ms-auto me-auto xl:me-0"
                            classNames={{
                                popoverContent: "bg-neutral-600",
                            }}
                            variant="bordered"
                            selectedKeys={[orderImages.toString()]}
                            labelPlacement="outside"
                            label={"Order"}
                            onChange={(e) => setOrderImages(e.target.value)}>
                            <SelectItem
                                className="dark"
                                key={"asc"}
                                value={"asc"}>
                                Ascending
                            </SelectItem>
                            <SelectItem
                                className="dark"
                                key={"desc"}
                                value={"desc"}>
                                Descending
                            </SelectItem>
                        </Select>
                    </div>
                    <div className="flex justify-center my-4">
                        <div className="flex justify-center">
                            <Pagination
                                className="dark mt-auto"
                                classNames={{
                                    cursor: "bg-orange-600",
                                }}
                                showControls
                                total={Math.ceil(
                                    selectedImages.length / imagesPerPage
                                )}
                                page={imagePage}
                                onChange={setImagePage}
                            />
                        </div>
                    </div>
                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-2">
                        {selectedImages.map(
                            (image: Images | Logos, index: number) => {
                                if (
                                    index >
                                        imagePage * imagesPerPage -
                                            (imagesPerPage + 1) &&
                                    index < imagePage * imagesPerPage
                                ) {
                                    return (
                                        <Tooltip
                                            delay={1000}
                                            placement="bottom"
                                            className="dark"
                                            key={image.name + "-" + index}
                                            content={image.name}>
                                            <div className="fade-in flex flex-col border rounded border-neutral-800">
                                                <div
                                                    onClick={() => {
                                                        setSelectedImage(
                                                            image.name
                                                        );
                                                        onOpenImage();
                                                    }}
                                                    className="cursor-pointer bg-neutral-600 bg-opacity-25 p-4 h-full flex w-full">
                                                    <Image
                                                        height={100}
                                                        width={100}
                                                        src={
                                                            image.name.split(
                                                                "_"
                                                            )[0] === "LOGO"
                                                                ? process.env
                                                                      .NEXT_PUBLIC_BASE_LOGO_URL +
                                                                  image.name
                                                                : process.env
                                                                      .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                                  image.name
                                                        }
                                                        alt={image.name}
                                                        className="w-full h-auto m-auto"
                                                    />
                                                </div>
                                                <div className="bg-neutral-800 bg-opacity-25">
                                                    <div
                                                        id={image.name}
                                                        className="text-center truncate p-2">
                                                        {
                                                            image.name
                                                                .split("-")[0]
                                                                .split("_")[1]
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    );
                                }
                            }
                        )}
                    </div>
                </div>
            </div>
            {/* Delete warning modal */}
            <Modal
                size="xl"
                backdrop="blur"
                isDismissable={false}
                isOpen={isOpenDelete}
                className="dark"
                onOpenChange={onOpenChangeDelete}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full flex justify-center">
                                    <div className="font-bold text-2xl text-red-400">
                                        WARNING
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {deleteErrorArray.length > 0 ? (
                                    <>
                                        <div className="w-full text-center">
                                            <div className="font-bold text-red-400 text-xl">
                                                This file is being used!
                                            </div>
                                        </div>

                                        <div className="font-bold text-xl">
                                            Details:
                                        </div>
                                        {deleteErrorArray.map(
                                            (
                                                error: errorResponse,
                                                index: number
                                            ) => {
                                                return (
                                                    <div
                                                        className="flex flex-col"
                                                        key={"error-" + index}>
                                                        <div>
                                                            <strong>
                                                                Used as:{" "}
                                                            </strong>
                                                            {error.type}
                                                        </div>
                                                        {error.caseTitle && (
                                                            <>
                                                                <div>
                                                                    <strong>
                                                                        Case
                                                                        Study:{" "}
                                                                    </strong>
                                                                    {
                                                                        error.caseTitle
                                                                    }
                                                                </div>
                                                            </>
                                                        )}
                                                        {error.segmentTitle && (
                                                            <>
                                                                <div>
                                                                    <strong>
                                                                        Segment:{" "}
                                                                    </strong>
                                                                    {
                                                                        error.segmentTitle
                                                                    }
                                                                </div>
                                                            </>
                                                        )}
                                                        {error.pageTitle && (
                                                            <>
                                                                <div>
                                                                    <strong>
                                                                        Page:{" "}
                                                                    </strong>
                                                                    {
                                                                        error.pageTitle
                                                                    }
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full">
                                        <div className="text-center">
                                            Please make sure this media is not
                                            used on any pages before deleting.
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {deleteErrorArray.length === 0 && (
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            deleteFile(
                                                toDelete.type,
                                                toDelete.file
                                            );
                                        }}>
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        onClose();

                                        setDeleteErrorArray([]);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Image view modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenImage}
                className="dark"
                onOpenChange={onOpenChangeImage}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{selectedImage}</ModalHeader>
                            <ModalBody>
                                <div>
                                    <Image
                                        height={1000}
                                        width={1000}
                                        src={
                                            selectedImage.split("_")[0] ===
                                            "LOGO"
                                                ? process.env
                                                      .NEXT_PUBLIC_BASE_LOGO_URL +
                                                  selectedImage
                                                : process.env
                                                      .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                  selectedImage
                                        }
                                        alt={selectedImage}
                                        className="max-w-full m-auto h-auto"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {props.session.user.role === "ADMIN" && (
                                    <Button
                                        className="rounded-md"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            onOpenChangeDelete();
                                            onClose();
                                            setToDelete({
                                                file: selectedImage,
                                                type: "image",
                                            });
                                        }}>
                                        Delete
                                    </Button>
                                )}
                                <a
                                    className="transition-all hover:bg-opacity-85 text-sm bg-orange-600 flex items-center px-2 py-1 rounded-md"
                                    href={
                                        selectedImage.split("_")[0] === "LOGO"
                                            ? process.env
                                                  .NEXT_PUBLIC_BASE_LOGO_URL +
                                              selectedImage
                                            : process.env
                                                  .NEXT_PUBLIC_BASE_IMAGE_URL +
                                              selectedImage
                                    }
                                    download>
                                    Download
                                </a>
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
            {/* Video view modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isOpen={isOpenVideo}
                className="dark"
                onOpenChange={onOpenChangeVideo}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{selectedVideo}</ModalHeader>
                            <ModalBody>
                                <div>
                                    <video
                                        playsInline
                                        disablePictureInPicture
                                        id="bg-video"
                                        controls={true}
                                        src={
                                            process.env
                                                .NEXT_PUBLIC_BASE_VIDEO_URL +
                                            selectedVideo
                                        }
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {props.session.user.role === "ADMIN" && (
                                    <Button
                                        className="rounded-md"
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            onOpenChangeDelete();
                                            onClose();
                                            setToDelete({
                                                file: selectedVideo,
                                                type: "video",
                                            });
                                        }}>
                                        Delete
                                    </Button>
                                )}
                                <a
                                    className="transition-all hover:bg-opacity-85 text-sm bg-orange-600 flex items-center px-2 py-1 rounded-md"
                                    href={
                                        process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                        selectedVideo
                                    }
                                    download>
                                    Download
                                </a>
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
            {/* Media upload modal */}
            <Modal
                hideCloseButton
                size="2xl"
                backdrop="blur"
                isOpen={isOpenUpload}
                className="dark"
                isDismissable={false}
                onOpenChange={onOpenChangeUpload}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-center">
                                Upload New Media
                            </ModalHeader>
                            <ModalBody>
                                <div className="mx-auto">
                                    <div className="text-center text-2xl font-bold">
                                        Naming Conventions
                                    </div>
                                    <div className="px-4 xl:text-base text-sm">
                                        <div className=" mt-4">
                                            When uploading new media please
                                            follow these naming conventions to
                                            make sure the media is served in the
                                            correct way and is visible on all
                                            areas of the site.
                                        </div>
                                        <div className="mt-2">
                                            All files should be prefixed with
                                            the correct keyword (listed below)
                                            and contain no other special
                                            characters. Specifically hyphens (-)
                                        </div>
                                        <div className="mt-2">
                                            <strong>For example:</strong>{" "}
                                            HEADER_NameOfImage.ext
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
                                                    Images
                                                </div>
                                                <div>
                                                    <strong>
                                                        Section Headers:{" "}
                                                    </strong>
                                                    SEGHEAD_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Section Images:{" "}
                                                    </strong>
                                                    SEGMENT_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Case Study Images:{" "}
                                                    </strong>
                                                    STUDY_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Logo Images:{" "}
                                                    </strong>
                                                    LOGO_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Video Thumbnail:{" "}
                                                    </strong>
                                                    THUMBNAIL_
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
                                                    Videos
                                                </div>
                                                <div>
                                                    <strong>
                                                        Background Videos:{" "}
                                                    </strong>
                                                    HEADER_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Other Videos:{" "}
                                                    </strong>
                                                    VIDEO_
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {namingError && (
                                    <div className="text-center text-red-400">
                                        Please check the file name prefix.
                                    </div>
                                )}
                                {sizeError && (
                                    <div className="text-center text-red-400">
                                        File size too large.
                                    </div>
                                )}
                                <div className="flex mx-auto mt-4">
                                    {uploading ? (
                                        <CircularProgress
                                            classNames={{
                                                svg: "w-28 h-28 drop-shadow-md",
                                                value: "text-2xl",
                                            }}
                                            showValueLabel={true}
                                            value={uploadProgress}
                                            color="warning"
                                            aria-label="Loading..."
                                            className="ms-4"
                                        />
                                    ) : (
                                        <div className="file-input">
                                            <input
                                                onChange={(e) => {
                                                    if (e.target.files) {
                                                        onSelectFile(
                                                            e.target.files[0]
                                                        );
                                                    }
                                                }}
                                                className="inputFile"
                                                type="file"
                                                name={"new-video"}
                                                id={"new-video"}
                                            />
                                            <label
                                                className="m-auto"
                                                htmlFor="new-video">
                                                {newUpload !== undefined
                                                    ? "Change"
                                                    : "Select file"}
                                            </label>
                                            <div className="text-center mt-4">
                                                {newUpload !== undefined
                                                    ? newUpload.name
                                                    : "Max size: 100MB"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!uploading && (
                                    <div className="flex justify-evenly">
                                        <Button
                                            onPress={() => {
                                                clearFileInput();
                                            }}
                                            color="danger">
                                            Clear
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                setUploading(true);
                                                uploadMedia();
                                            }}
                                            disabled={newUpload ? false : true}
                                            className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-600 ">
                                            Upload
                                        </Button>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {!uploading && (
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            setUploading(false);
                                            setNamingError(false);
                                            setSizeError(false);
                                            onClose();
                                            clearFileInput();
                                        }}>
                                        Close
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
