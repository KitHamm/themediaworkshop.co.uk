"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
} from "@nextui-org/react";
import { Images, Videos } from "@prisma/client";

export default function Media(props: {
    hidden: boolean;
    revalidateDashboard: any;
}) {
    const [videos, setVideos] = useState<Videos[]>([]);
    const [images, setImages] = useState<Images[]>([]);
    const [newUpload, setNewUpload] = useState<File>();
    const [uploading, setUploading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [toDelete, setToDelete] = useState({ file: "", type: "" });
    const {
        isOpen: isOpenImage,
        onOpen: onOpenImage,
        onOpenChange: onOpenChangeImage,
    } = useDisclosure();
    const {
        isOpen: isOpenVideo,
        onOpen: onOpenVideo,
        onOpenChange: onOpenChangeVideo,
    } = useDisclosure();
    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onOpenChange: onOpenChangeDelete,
    } = useDisclosure();

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

    async function handleUpload() {
        var type;
        var url;
        const formData = new FormData();
        if (newUpload) {
            formData.append("file", newUpload);
            type = newUpload.type.split("/")[0];
            if (type === "video") {
                url = "/api/uploadvideo";
            } else {
                url = "/api/uploadimage";
            }
        }
        const response = await fetch(url as string, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    setUploading(false);
                    clearFileInput();
                    getVideos();
                    getImages();
                }
            })
            .catch((error) => console.log(error));
    }

    async function deleteFile(type: string, file: string) {
        var dir;
        if (type === "image") {
            dir = process.env.NEXT_PUBLIC_DELETE_IMAGE_DIR;
        } else {
            dir = process.env.NEXT_PUBLIC_DELETE_VIDEO_DIR;
        }

        const response = await fetch("/api/deletefile", {
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

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20`}>
            <div className="my-10">
                <div className="border-b py-4 mb-10 text-3xl font-bold capitalize">
                    Media
                </div>
                <div className="my-6">
                    <div className="font-bold mb-2">Upload New</div>
                    <div className=" flex">
                        <div className="file-input">
                            <input
                                onChange={(e) => {
                                    if (e.target.files)
                                        setNewUpload(e.target.files[0]);
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
                        <div className="flex my-auto">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setUploading(true);
                                    handleUpload();
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
                    </div>
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

                        <div className="xl:grid xl:grid-cols-4 xl:gap-4">
                            {videos.map((video: Videos, index: number) => {
                                return (
                                    <div
                                        key={video.name + "-" + index}
                                        className="flex flex-col">
                                        <div
                                            onClick={() => {
                                                setSelectedVideo(video.name);
                                                onOpenVideo();
                                            }}
                                            className="cursor-pointer border rounded p-4 h-full flex w-full">
                                            <Image
                                                height={100}
                                                width={100}
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                    "play.png"
                                                }
                                                alt="play"
                                                className="w-full h-auto m-auto"
                                            />
                                        </div>
                                        <div className="text-center truncate mt-4 h-full">
                                            {video.name}
                                        </div>
                                        <div
                                            onClick={() => {
                                                onOpenChangeDelete();
                                                setToDelete({
                                                    file: video.name,
                                                    type: "video",
                                                });
                                            }}
                                            className="cursor-pointer text-center">
                                            <i
                                                aria-hidden
                                                className="text-red-500 fa-solid fa-trash"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between border-b mb-5">
                            <div className="font-bold text-xl">Images</div>
                            <i
                                onClick={() => getImages()}
                                aria-hidden
                                className="cursor-pointer fa-solid fa-arrows-rotate"
                            />
                        </div>
                        <div className="xl:grid xl:grid-cols-4 xl:gap-4">
                            {images.map((image: Images, index: number) => {
                                return (
                                    <div
                                        key={image.name + "-" + index}
                                        className="flex flex-col">
                                        <div
                                            onClick={() => {
                                                setSelectedImage(image.name);
                                                onOpenImage();
                                            }}
                                            className="cursor-pointer border rounded p-4 h-full flex w-full">
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
                                        <div className="text-center mt-4">
                                            {image.name}
                                        </div>
                                        <div
                                            onClick={() => {
                                                onOpenChangeDelete();
                                                setToDelete({
                                                    file: image.name,
                                                    type: "image",
                                                });
                                            }}
                                            className="cursor-pointer text-center">
                                            <i
                                                aria-hidden
                                                className="text-red-500 fa-solid fa-trash"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
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
                                        className="m-auto h-auto w-auto"
                                    />
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
    );
}
