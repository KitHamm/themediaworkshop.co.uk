"use client";

import { Page } from "@prisma/client";
import { useState } from "react";

export default function PageEdit(props: {
    data: Page;
    hidden: boolean;
    revalidateDashboard: any;
}) {
    const [description, setDescription] = useState(props.data.description);
    const [backgroundVideo, setBackgroundVideo] = useState(props.data.video);
    const [showreel, setShowreel] = useState(props.data.showreel);

    async function updateDescription() {
        try {
            const response = await fetch("/api/updatepage", {
                method: "POST",
                body: JSON.stringify({
                    id: props.data.id as number,
                    data: {
                        description: description,
                    },
                }),
            });
            if (response.ok) {
                await response.json();
                props.revalidateDashboard();
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
                            <input id="bg-video" type="text" />
                        </div>
                        <div>
                            <label htmlFor="showreel">Showreel</label>
                            <input id="showreel" type="text" />
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
                        value={description}
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
                            updateDescription();
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
