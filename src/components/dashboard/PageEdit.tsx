"use client";

import { Page, Segment } from "@prisma/client";
import { useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import EditSegment from "./Segment";
import NewSegment from "./NewSegment";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
    bgVideos: string[];
}) {
    const [description, setDescription] = useState(
        props.data.description ? props.data.description : ""
    );
    const [checkDescription, setCheckDescription] = useState(
        props.data.description ? props.data.description : ""
    );
    const [header, setHeader] = useState(
        props.data.header ? props.data.header : ""
    );
    const [video, setVideo] = useState(
        props.data.video ? props.data.video : "None"
    );
    const [showreel, setShowreel] = useState(
        props.data.showreel ? props.data.showreel : "None"
    );
    const [newSegmentModal, setNewSegmentModal] = useState(false);
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

    async function updatePage(json: any) {
        const response = await fetch("/api/updatepage", {
            method: "POST",
            body: JSON.stringify({
                id: props.data.id as number,
                data: json,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    if (props.data.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.data.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in mb-10`}>
            <div className="my-10 border-b py-4 text-3xl font-bold capitalize">
                {props.data.title}
            </div>
            <div className="">
                <div id="top" className="xl:grid xl:grid-cols-2 xl:gap-10">
                    <div id="left-column">
                        <div className="border-b pb-2">Page Videos</div>
                        <div className="xl:grid xl:grid-cols-2 xl:gap-10">
                            <div>
                                {props.bgVideos.length > 1 ? (
                                    <Select
                                        disabledKeys={["None"]}
                                        label="Background Video"
                                        placeholder="Select a video"
                                        className="max-w-xs text-black my-4"
                                        defaultSelectedKeys={[video]}
                                        onChange={(e) =>
                                            setVideo(e.target.value)
                                        }>
                                        {props.bgVideos.map(
                                            (videoName: string) => {
                                                return (
                                                    <SelectItem
                                                        className="text-black"
                                                        key={videoName}>
                                                        {videoName}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </Select>
                                ) : (
                                    ""
                                )}
                                <div className="flex justify-end">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleBackgroundVideo();
                                        }}
                                        disabled={
                                            video === props.data.video ||
                                            video === "None"
                                                ? true
                                                : false
                                        }
                                        className="disabled:text-black disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 rounded-md px-4 py-2">
                                        Update
                                    </button>
                                </div>
                            </div>
                            <div>
                                {props.bgVideos.length > 1 ? (
                                    <Select
                                        label="Showreel"
                                        placeholder="Select a video"
                                        className="max-w-xs text-black my-4"
                                        defaultSelectedKeys={[showreel]}
                                        onChange={(e) =>
                                            setShowreel(e.target.value)
                                        }>
                                        {props.bgVideos.map(
                                            (videoName: string) => {
                                                return (
                                                    <SelectItem
                                                        className="text-black"
                                                        key={videoName}>
                                                        {videoName}
                                                    </SelectItem>
                                                );
                                            }
                                        )}
                                    </Select>
                                ) : (
                                    ""
                                )}
                                <div className="flex justify-end">
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
                                        className="disabled:text-black disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 rounded-md px-4 py-2">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="my-10">
                            <div className="border-b pb-2 mb-2">Header</div>
                            <input
                                placeholder="Title"
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                id={"header-" + props.data.title}
                                name={"header-" + props.data.title}
                                type="text"
                                className="text-black"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleHeader();
                                    }}
                                    disabled={
                                        header === props.data.header ||
                                        header === ""
                                            ? true
                                            : false
                                    }
                                    className="disabled:text-black disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 rounded-md px-4 py-2">
                                    Update
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="border-b pb-2 mb-2">
                                Description
                            </div>
                            <textarea
                                value={description ? description : ""}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                name={"description-" + props.data.title}
                                id={"description-" + props.data.title}
                                className="text-black h-52"
                            />
                            <div className="flex justify-end">
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
                                    className="disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-400 disabled:text-black rounded-md px-4 py-2">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="right-colum"></div>
                </div>
                <div id="segments">
                    <div className="border-b pb-2 mb-2 font-bold text-2xl">
                        Segments
                    </div>
                    {props.data.segment.map(
                        (segment: Segment, index: number) => {
                            return (
                                <div key={segment.title + "-" + index}>
                                    <EditSegment
                                        revalidateDashboard={
                                            props.revalidateDashboard
                                        }
                                        title={props.data.title}
                                        segment={segment}
                                        index={index}
                                    />
                                </div>
                            );
                        }
                    )}
                    {!newSegmentModal ? (
                        <div className="flex justify-end mt-10 mb-10">
                            <button
                                onClick={() => setNewSegmentModal(true)}
                                className="bg-orange-400 px-4 py-2 rounded">
                                Add Segment
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            {newSegmentModal ? (
                <NewSegment
                    pageID={props.data.id}
                    title={props.data.title}
                    revalidateDashboard={props.revalidateDashboard}
                    setNewSegmentModal={setNewSegmentModal}
                />
            ) : (
                ""
            )}
        </div>
    );
}
