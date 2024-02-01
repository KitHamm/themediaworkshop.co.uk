"use client";

import { Page } from "@prisma/client";
import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
    bgVideos: string[];
}) {
    const [description, setDescription] = useState(
        props.data.description ? props.data.description : ""
    );
    const [header, setHeader] = useState(
        props.data.header ? props.data.header : ""
    );
    const [video, setVideo] = useState(
        props.data.video ? props.data.video : "Select Video"
    );
    const [showreel, setShowreel] = useState(
        props.data.showreel ? props.data.showreel : "Select Video"
    );
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

    function handleHeader() {
        const json = {
            header: header,
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
            "new-video-" + props.data.title
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
                            <label htmlFor={"bg-video-" + props.data.title}>
                                Background Video
                            </label>
                            <Select
                                disabledKeys={["Select Video"]}
                                label="Background Video"
                                placeholder="Select a video"
                                className="max-w-xs text-black my-4"
                                defaultSelectedKeys={[video]}
                                onChange={(e) => setVideo(e.target.value)}>
                                {props.bgVideos.map((videoName: string) => {
                                    return (
                                        <SelectItem
                                            className="text-black"
                                            key={videoName}>
                                            {videoName}
                                        </SelectItem>
                                    );
                                })}
                            </Select>
                            <div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBackgroundVideo();
                                    }}
                                    disabled={
                                        video === props.data.video ||
                                        video === "Select Video"
                                            ? true
                                            : false
                                    }
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                                    Update
                                </button>
                            </div>
                            <div className="mt-6">
                                <label
                                    htmlFor={"new-video-" + props.data.title}>
                                    Upload New Video
                                </label>
                                <input
                                    onChange={(e) => {
                                        if (e.target.files)
                                            setNewVideo(e.target.files[0]);
                                    }}
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2"
                                    type="file"
                                    name={"new-video-" + props.data.title}
                                    id={"new-video-" + props.data.title}
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
                            <label htmlFor={"showreel-" + props.data.title}>
                                Showreel
                            </label>
                            <Select
                                disabledKeys={["Select Video"]}
                                label="Background Video"
                                placeholder="Select a video"
                                className="max-w-xs text-black my-4"
                                defaultSelectedKeys={[showreel]}
                                onChange={(e) => setShowreel(e.target.value)}>
                                {props.bgVideos.map((videoName: string) => {
                                    return (
                                        <SelectItem
                                            className="text-black"
                                            key={videoName}>
                                            {videoName}
                                        </SelectItem>
                                    );
                                })}
                            </Select>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleShowreel();
                                }}
                                disabled={
                                    showreel === props.data.showreel ||
                                    showreel === "Select Video"
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
                {/* Left Column */}
                <div>
                    <label htmlFor={"header-" + props.data.title}>Title</label>
                    {/* <textarea
                        value={description ? description : ""}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        name={"description-" + props.data.title}
                        id={"description-" + props.data.title}
                        className="text-black h-52"
                    /> */}
                    <input
                        placeholder="Title"
                        value={header}
                        onChange={(e) => setHeader(e.target.value)}
                        id={"header-" + props.data.title}
                        name={"header-" + props.data.title}
                        type="text"
                        className="text-black"
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleHeader();
                        }}
                        disabled={
                            header === props.data.header || header === ""
                                ? true
                                : false
                        }
                        className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 text-black rounded-md px-4 py-2">
                        Update
                    </button>
                </div>
                <div className="xl:flex">
                    <div className="my-auto">The Page Title</div>
                </div>
                <div>
                    <label htmlFor={"description-" + props.data.title}>
                        Description
                    </label>
                    <textarea
                        value={description ? description : ""}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        name={"description-" + props.data.title}
                        id={"description-" + props.data.title}
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
