"use client";

import { Page } from "@prisma/client";
import { useEffect, useState } from "react";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
    bgVideos: string[];
}) {
    const [description, setDescription] = useState(props.data.description);
    const [video, setVideo] = useState(props.data.video);
    const [showreel, setShowreel] = useState(props.data.showreel);
    const [newVideo, setNewVideo] = useState<File>();
    const [uploading, setUploading] = useState(false);

    async function handleUploadVideo() {
        const formData = new FormData();
        if (newVideo) {
            formData.append("file", newVideo);
        }
        const response = await fetch("/api/uploadvideo", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Done");
                    setUploading(false);
                    clearFileInput();
                    if (props.data.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.data.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    function handleDescription() {
        const json = {
            description: description,
        };
        updatePage(json);
    }

    function handleBackgroundVideo() {
        const json = {
            video: video,
        };
        updatePage(json);
    }

    function handleShowreel() {
        const json = {
            showreel: showreel,
        };
        updatePage(json);
    }

    function clearFileInput() {
        const inputElm = document.getElementById(
            "new-video"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
        setNewVideo(undefined);
    }

    async function updatePage(json: any) {
        try {
            const response = await fetch("/api/updatepage", {
                method: "POST",
                body: JSON.stringify({
                    id: props.data.id as number,
                    data: json,
                }),
            });
            if (response.ok) {
                console.log("Done");

                if (props.data.title === "home") {
                    props.revalidateDashboard("/");
                } else {
                    props.revalidateDashboard("/" + props.data.title);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20`}>
            <div className="my-10 border-b py-4 text-3xl font-bold capitalize">
                Editing {props.data.title}
            </div>
            <div className="xl:grid xl:grid-cols-2 xl:gap-10">
                {/* Left Column */}
                <div id="left-column">
                    <div className="xl:grid xl:grid-cols-2 xl:gap-10">
                        <div>
                            <label htmlFor="bg-video">Background Video</label>
                            <select
                                defaultValue={video ? video : ""}
                                className="text-black"
                                name="bg-video"
                                id="bg-video"
                                onChange={(e) => setVideo(e.target.value)}>
                                <option value="" disabled>
                                    Select an option
                                </option>
                                {props.bgVideos.map(
                                    (videoUrl: string, index: number) => {
                                        return (
                                            <option
                                                key={"video-" + index}
                                                value={videoUrl}>
                                                {videoUrl}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                            <div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBackgroundVideo();
                                    }}
                                    disabled={
                                        video === props.data.video
                                            ? true
                                            : false
                                    }
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                                    Update
                                </button>
                            </div>
                            <div className="mt-6">
                                <label htmlFor="new-video">
                                    Upload New Video
                                </label>
                                <input
                                    onChange={(e) => {
                                        if (e.target.files)
                                            setNewVideo(e.target.files[0]);
                                    }}
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2"
                                    type="file"
                                    name="new-video"
                                    id="new-video"
                                />
                                <div className="flex">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("Video");
                                            setUploading(true);
                                            handleUploadVideo();
                                        }}
                                        disabled={newVideo ? false : true}
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
                        </div>
                        <div>
                            <label htmlFor="showreel">Showreel</label>
                            <select
                                defaultValue={showreel ? showreel : ""}
                                className="text-black"
                                name="showreel"
                                id="showreel"
                                onChange={(e) => setShowreel(e.target.value)}>
                                <option value="" disabled>
                                    Select an option
                                </option>
                                {props.bgVideos.map(
                                    (videoUrl: string, index: number) => {
                                        return (
                                            <option
                                                key={"video-" + index}
                                                value={videoUrl}>
                                                {videoUrl}
                                            </option>
                                        );
                                    }
                                )}
                            </select>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleShowreel();
                                }}
                                disabled={
                                    showreel === props.data.showreel
                                        ? true
                                        : false
                                }
                                className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
                {/* Right column */}
                <div className="xl:flex">
                    <div className="my-auto">
                        Set the URL for the background video of the page (
                        <em>required</em>) and the showreel.
                    </div>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        value={description ? description : ""}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        name="description"
                        id="description"
                        className="text-black h-52"
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleDescription();
                        }}
                        disabled={
                            description === props.data.description
                                ? true
                                : false
                        }
                        className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                        Update
                    </button>
                </div>
                <div className="xl:flex">
                    <div className="my-auto">
                        The description that is situated on top of the
                        background video.
                    </div>
                </div>
            </div>
        </div>
    );
}
