import { Segment } from "@prisma/client";
import { useState } from "react";

export default function EditSegment(props: {
    segment: Segment;
    index: number;
    title: string;
    revalidateDashboard: any;
}) {
    const [title, setTitle] = useState(props.segment.title);
    const [copy, setCopy] = useState(props.segment.copy);

    function handleTitle() {
        const json = {
            title: title,
        };
        updateSegment(json);
    }

    function handleCopy() {
        const json = {
            copy: copy,
        };
        updateSegment(json);
    }

    async function updateSegment(json: any) {
        const response = await fetch("/api/updatesegment", {
            method: "POST",
            body: JSON.stringify({
                id: props.segment.id as number,
                data: json,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    if (props.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    async function deleteSegment() {
        const response = await fetch("/api/deletesegment", {
            method: "POST",
            body: JSON.stringify({ id: props.segment.id }),
        })
            .then((response) => {
                if (response.ok) {
                    if (props.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.title);
                    }
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className="bg-neutral-600 rounded-lg px-10 mb-4 pb-10">
            <div className="flex justify-between">
                <div className="font-bold text-2xl my-5">{props.index + 1}</div>

                <div className="my-auto">
                    <button
                        onClick={deleteSegment}
                        className="bg-red-400 px-4 py-2 rounded">
                        Delete
                    </button>
                </div>
            </div>
            <div className="xl:grid xl:grid-cols-2 xl:gap-10 px-10">
                <div id={"left-segment-" + props.index + "-column"}>
                    <div>
                        <div className="border-b pb-2 mb-2">Title</div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="text-black"
                        />
                        <div className="flex justify-end">
                            <button
                                disabled={
                                    title === props.segment.title ? true : false
                                }
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleTitle();
                                }}
                                className={`disabled:text-black disabled:bg-neutral-800 disabled:cursor-not-allowed bg-orange-400 px-4 py-2 rounded`}>
                                Update
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="border-b pb-2 mb-2">Copy</div>
                        <textarea
                            value={copy}
                            onChange={(e) => setCopy(e.target.value)}
                            className="text-black h-52"
                            name=""
                            id=""
                        />
                        <div className="flex justify-end">
                            <button
                                disabled={
                                    copy === props.segment.copy ? true : false
                                }
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCopy();
                                }}
                                className={`disabled:text-black disabled:bg-neutral-800 disabled:cursor-not-allowed bg-orange-400 px-4 py-2 rounded`}>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className={
                        "right-segment-" + props.index + "-column"
                    }></div>
            </div>
        </div>
    );
}
