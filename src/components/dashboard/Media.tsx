"use client";

import { useEffect, useState } from "react";
import VideoViewer from "./VideoViewer";
import ImageViewer from "./ImageViewer";

export default function Media(props: {
    hidden: boolean;
    revalidateDashboard: any;
}) {
    const [videos, setVideos] = useState([]);
    const [images, setImages] = useState([]);
    const [newUpload, setNewUpload] = useState<File>();
    const [uploading, setUploading] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        getVideos();
        getImages();
    }, []);

    async function getVideos() {
        fetch("/api/videos", { method: "GET" })
            .then((res) => res.json())
            .then((json) => setVideos(json))
            .catch((err) => console.log(err));
    }

    async function getImages() {
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
                file: dir + file,
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
                    <div className="w-full">
                        <div className="font-bold mb-2">Upload New</div>
                        <input
                            onChange={(e) => {
                                if (e.target.files)
                                    setNewUpload(e.target.files[0]);
                            }}
                            className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2"
                            type="file"
                            name={"new-video"}
                            id={"new-video"}
                        />
                    </div>
                    <div className="flex">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setUploading(true);
                                handleUpload();
                            }}
                            disabled={newUpload ? false : true}
                            className="mt-2 disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                            Upload
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                clearFileInput();
                            }}
                            className="mt-2 ms-4 bg-red-400 text-black rounded-md px-4 py-2">
                            Clear
                        </button>
                    </div>
                    <div>{uploading ? "Uploading..." : ""}</div>
                </div>
                <div className="xl:flex xl:grid-cols-2 xl:gap-10">
                    <div className="w-full">
                        <div className="font-bold text-xl border-b mb-5">
                            Videos
                        </div>

                        <div className="xl:grid xl:grid-cols-4 xl:gap-4">
                            {videos.map((video: string, index: number) => {
                                if (video !== "None") {
                                    return (
                                        <div
                                            key={video}
                                            onClick={() => {
                                                setSelectedVideo(video);
                                                setVideoModalOpen(true);
                                            }}
                                            className="flex flex-col">
                                            <div className="cursor-pointer border rounded p-4 h-full flex w-full">
                                                <img
                                                    src={"images/play.png"}
                                                    alt={video}
                                                    className="w-full h-auto m-auto"
                                                />
                                            </div>
                                            <div className="text-center truncate mt-4 h-full">
                                                {video}
                                            </div>
                                            <div
                                                onClick={() =>
                                                    deleteFile("video", video)
                                                }
                                                className="cursor-pointer text-center">
                                                X
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="font-bold text-xl border-b mb-5">
                            Images
                        </div>
                        <div className="xl:grid xl:grid-cols-4 xl:gap-4">
                            {images.map((image: string, index: number) => {
                                if (image !== "None") {
                                    return (
                                        <div
                                            key={image}
                                            className="flex flex-col">
                                            <div
                                                onClick={() => {
                                                    setSelectedImage(image);
                                                    setImageModalOpen(true);
                                                }}
                                                className="cursor-pointer border rounded p-4 h-full flex w-full">
                                                <img
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_BASE_IMAGE_URL +
                                                        image
                                                    }
                                                    alt={image}
                                                    className="w-full h-auto m-auto"
                                                />
                                            </div>
                                            <div className="text-center mt-4">
                                                {image}
                                            </div>
                                            <div
                                                onClick={() =>
                                                    deleteFile("image", image)
                                                }
                                                className="cursor-pointer text-center">
                                                X
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <VideoViewer
                open={videoModalOpen}
                video={selectedVideo}
                setVideoModalOpen={setVideoModalOpen}
            />
            <ImageViewer
                open={imageModalOpen}
                image={selectedImage}
                setImageModalOpen={setImageModalOpen}
            />
        </div>
    );
}
