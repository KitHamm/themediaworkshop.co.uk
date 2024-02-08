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
} from "@nextui-org/react";

// React Components
import { useEffect, useState } from "react";

// Next Components
import Image from "next/image";
import { useSearchParams } from "next/navigation";

// Types
import { Images, Videos } from "@prisma/client";

// Functions
import uploadHandler from "./uploadHandler";
import Link from "next/link";

// File Prefix Values

const filePrefixList = [
    "HEADER",
    "SHOWREEL",
    "YEAR",
    "SEGHEAD",
    "SEGMENT",
    "STUDY",
];

export default function Media(props: {
    hidden: boolean;
    revalidateDashboard: any;
}) {
    // Search Param state to set which videos or images to view
    const searchParams = useSearchParams();
    const videoView: string = searchParams.get("video")
        ? searchParams.get("video")!
        : "background";
    const imageView: string = searchParams.get("image")
        ? searchParams.get("image")!
        : "header";

    // States of videos and Images to display
    const [videos, setVideos] = useState<Videos[]>([]);
    const [images, setImages] = useState<Images[]>([]);

    // State for file to upload
    const [newUpload, setNewUpload] = useState<File>();

    // Is uploading state
    const [uploading, setUploading] = useState(false);

    // Selected Video and Image to view in modal
    const [selectedVideo, setSelectedVideo] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    // Error state for if the media upload has wrong naming convention
    const [namingError, setNamingError] = useState(false);

    // Delete state with file and file type
    const [toDelete, setToDelete] = useState({ file: "", type: "" });

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
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onOpenChange: onOpenChangeDelete,
    } = useDisclosure();
    // Upload modal declaration
    const {
        isOpen: isOpenUpload,
        onOpen: onOpenUpload,
        onOpenChange: onOpenChangeUpload,
    } = useDisclosure();

    // Get initial videos and images to populate pool
    useEffect(() => {
        getVideos();
        getImages();
    }, []);

    async function getVideos() {
        props.revalidateDashboard("/");
        fetch("/api/videos", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setVideos(json))
            .catch((err) => console.log(err));
    }

    async function getImages() {
        props.revalidateDashboard("/");
        fetch("/api/images", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setImages(json))
            .catch((err) => console.log(err));
    }

    // Delete media depending on file type
    async function uploadMedia() {
        if (newUpload) {
            const type = newUpload.type.split("/")[0];
            await uploadHandler(newUpload, type)
                .then((res: any) => {
                    if (res.message) {
                        setUploading(false);
                        clearFileInput();
                        getVideos();
                        getImages();
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    async function deleteFile(type: string, file: string) {
        var dir;
        if (type === "image") {
            dir = process.env.NEXT_PUBLIC_DELETE_IMAGE_DIR;
        } else {
            dir = process.env.NEXT_PUBLIC_DELETE_VIDEO_DIR;
        }

        await fetch("/api/deletefile", {
            method: "POST",
            body: JSON.stringify({
                name: file,
                file: dir + file,
                type: type,
            }),
        })
            .then((res) => {
                if (res.ok) {
                    getVideos();
                    getImages();
                }
            })
            .catch((err) => console.log(err));
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

    function fileNamingCheck(fileName: string) {
        const filePrefix = fileName.split("_")[0];
        return filePrefixList.includes(filePrefix);
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in`}>
            <div className="my-10">
                <div className="border-b py-4 mb-10 text-3xl font-bold capitalize">
                    Media
                </div>
                <div className="my-6">
                    <button
                        onClick={onOpenChangeUpload}
                        className="px-10 py-4 rounded bg-orange-400">
                        Upload Media
                    </button>
                </div>
                <div className="xl:flex xl:grid-cols-2 xl:gap-10">
                    <div className="w-full">
                        <div className="flex justify-between border-b mb-5">
                            <div className="font-bold text-xl">Videos</div>
                            <i
                                onClick={() => getVideos()}
                                aria-hidden
                                className="cursor-pointer fa-solid fa-arrows-rotate"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <Link
                                href={
                                    `?view=media&video=background&image=` +
                                    imageView
                                }
                                className={`${
                                    videoView === "background"
                                        ? "bg-orange-400"
                                        : "bg-neutral-600"
                                } px-4 py-2 rounded transition-all`}>
                                Background
                            </Link>
                            <Link
                                href={
                                    `?view=media&video=showreel&image=` +
                                    imageView
                                }
                                className={`${
                                    videoView === "showreel"
                                        ? "bg-orange-400"
                                        : "bg-neutral-600"
                                } px-4 py-2 rounded transition-all`}>
                                Showreel
                            </Link>
                            <Link
                                href={
                                    `?view=media&video=year&image=` + imageView
                                }
                                className={`${
                                    videoView === "year"
                                        ? "bg-orange-400"
                                        : "bg-neutral-600"
                                } px-4 py-2 rounded transition-all`}>
                                Year Review
                            </Link>
                            <Link
                                href={
                                    `?view=media&video=study&image=` + imageView
                                }
                                className={`${
                                    videoView === "study"
                                        ? "bg-orange-400"
                                        : "bg-neutral-600"
                                } px-4 py-2 rounded transition-all`}>
                                Case Study
                            </Link>
                        </div>
                        {/* Videos section */}
                        <div className="xl:grid xl:grid-cols-4 xl:gap-4">
                            {videos.map((video: Videos, index: number) => {
                                if (
                                    (videoView === "background" &&
                                        video.name.split("_")[0] ===
                                            "HEADER") ||
                                    (videoView === "showreel" &&
                                        video.name.split("_")[0] ===
                                            "SHOWREEL") ||
                                    (videoView === "year" &&
                                        video.name.split("_")[0] === "YEAR") ||
                                    (videoView === "study" &&
                                        video.name.split("_")[0] === "STUDY") ||
                                    videoView === "all"
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
                                                        className="w-full h-auto m-auto"
                                                    />
                                                </div>
                                                <div className="bg-neutral-800 bg-opacity-25">
                                                    <div className="text-center truncate p-2 h-full">
                                                        {video.name.includes(
                                                            "_"
                                                        )
                                                            ? video.name.includes(
                                                                  "-"
                                                              )
                                                                ? video.name
                                                                      .split(
                                                                          "_"
                                                                      )[1]
                                                                      .split(
                                                                          "-"
                                                                      )[0]
                                                                : video.name.split(
                                                                      "_"
                                                                  )[1]
                                                            : video.name.includes(
                                                                  "-"
                                                              )
                                                            ? video.name.split(
                                                                  "-"
                                                              )[0]
                                                            : video.name}
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
                        <div className="flex justify-between border-b mb-5">
                            <div className="font-bold text-xl">Images</div>
                            <i
                                onClick={() => getImages()}
                                aria-hidden
                                className="cursor-pointer fa-solid fa-arrows-rotate"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <Link
                                href={
                                    `?view=media&video=` +
                                    videoView +
                                    `&image=header`
                                }
                                className={`${
                                    imageView === "header"
                                        ? "bg-orange-400"
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
                                        ? "bg-orange-400"
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
                                        ? "bg-orange-400"
                                        : "bg-neutral-600"
                                } px-4 py-2 rounded transition-all`}>
                                Case Study
                            </Link>
                        </div>
                        <div className="xl:grid xl:grid-cols-4 xl:gap-2">
                            {images.map((image: Images, index: number) => {
                                if (
                                    (imageView === "header" &&
                                        image.name.split("_")[0] ===
                                            "SEGHEAD") ||
                                    (imageView === "segment" &&
                                        image.name.split("_")[0] ===
                                            "SEGMENT") ||
                                    (imageView === "study" &&
                                        image.name.split("_")[0] ===
                                            "CASESTUDY") ||
                                    imageView === "all"
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
                                                            process.env
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
                                                        {image.name.includes(
                                                            "_"
                                                        )
                                                            ? image.name.includes(
                                                                  "-"
                                                              )
                                                                ? image.name
                                                                      .split(
                                                                          "_"
                                                                      )[1]
                                                                      .split(
                                                                          "-"
                                                                      )[0]
                                                                : image.name.split(
                                                                      "_"
                                                                  )[1]
                                                            : image.name.includes(
                                                                  "-"
                                                              )
                                                            ? image.name.split(
                                                                  "-"
                                                              )[0]
                                                            : image.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </Tooltip>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete warning modal */}
            <Modal
                size="xl"
                backdrop="blur"
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
                                <div className="w-full">
                                    <div className="text-center">
                                        Please make sure this media is not used
                                        on any pages before deleting.
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        deleteFile(
                                            toDelete.type,
                                            toDelete.file
                                        );
                                        onClose();
                                    }}>
                                    Delete
                                </Button>
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
                                            process.env
                                                .NEXT_PUBLIC_BASE_IMAGE_URL +
                                            selectedImage
                                        }
                                        alt={selectedImage}
                                        className="max-w-full m-auto h-auto"
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
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
                                <Button
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
            {/* Media upload modal */}
            <Modal
                size="lg"
                backdrop="blur"
                isOpen={isOpenUpload}
                className="dark"
                isDismissable={false}
                onOpenChange={onOpenChangeUpload}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Upload New Media</ModalHeader>
                            <ModalBody>
                                <div className="mx-auto">
                                    <div className="text-center text-2xl font-bold">
                                        Naming Conventions
                                    </div>
                                    <div className="px-4">
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
                                        <div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
                                            Images
                                        </div>
                                        <div>
                                            <strong>Section Headers: </strong>
                                            SEGHEAD_
                                        </div>
                                        <div>
                                            <strong>Section Images: </strong>
                                            SEGMENT_
                                        </div>
                                        <div>
                                            <strong>Case Study Images: </strong>
                                            STUDY_
                                        </div>
                                        <div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
                                            Videos
                                        </div>
                                        <div>
                                            <strong>Background Videos: </strong>
                                            HEADER_
                                        </div>
                                        <div>
                                            <strong>Showreel Videos: </strong>
                                            SHOWREEL_
                                        </div>
                                        <div>
                                            <strong>
                                                Year Review Videos:{" "}
                                            </strong>
                                            YEAR_
                                        </div>
                                    </div>
                                </div>
                                {namingError && (
                                    <div className="text-center text-red-400">
                                        Please check the file name prefix
                                    </div>
                                )}
                                <div className="flex mx-auto mt-4">
                                    <div className="file-input">
                                        <input
                                            onChange={(e) => {
                                                if (e.target.files)
                                                    if (
                                                        fileNamingCheck(
                                                            e.target.files[0]
                                                                .name
                                                        )
                                                    ) {
                                                        setNamingError(false);
                                                        setNewUpload(
                                                            e.target.files[0]
                                                        );
                                                    } else {
                                                        setNamingError(true);
                                                    }
                                            }}
                                            className="inputFile"
                                            type="file"
                                            name={"new-video"}
                                            id={"new-video"}
                                        />
                                        <label htmlFor="new-video">
                                            {newUpload !== undefined
                                                ? newUpload.name
                                                : "Select file"}
                                        </label>
                                    </div>
                                    {uploading ? (
                                        <CircularProgress
                                            color="warning"
                                            aria-label="Loading..."
                                            className="ms-4"
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div className="flex justify-evenly">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setUploading(true);
                                            uploadMedia();
                                        }}
                                        disabled={newUpload ? false : true}
                                        className="ms-4 my-auto disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                                        Upload
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            clearFileInput();
                                        }}
                                        className="my-auto ms-4 bg-red-400 text-black rounded-md px-4 py-2">
                                        Clear
                                    </button>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        setNamingError(false);
                                        onClose();
                                        clearFileInput();
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
