import { SetStateAction, useState } from "react";

export default function NewSegment(props: {
    setNewSegmentModal: any;
    revalidateDashboard: any;
    title: string;
    pageID: number;
}) {
    const [title, setTitle] = useState("");
    const [copy, setCopy] = useState("");

    async function addSegment() {
        const response = await fetch("/api/addsegment", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                copy: copy,
                page: {
                    connect: {
                        id: props.pageID,
                    },
                },
            }),
        })
            .then((response) => {
                if (response.ok) {
                    setTitle("");
                    setCopy("");
                    props.setNewSegmentModal(false);
                    if (props.title === "home") {
                        props.revalidateDashboard("/");
                    } else {
                        props.revalidateDashboard("/" + props.title);
                    }
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <div className="font-bold text-2xl my-5">New Segment</div>
            <div className="xl:grid xl:grid-cols-2 xl:gap-10 px-10">
                <div id={"left-segment-new-column"}>
                    <div>
                        <div className="border-b pb-2 mb-2">Title</div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="text-black"
                        />
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
                    </div>
                </div>
                <div className={"right-segment-new-column"}></div>
            </div>
            <div className="flex justify-between px-10">
                <button
                    onClick={() => {
                        setTitle("");
                        setCopy("");
                        props.setNewSegmentModal(false);
                    }}
                    className="px-4 py-2 bg-orange-400 rounded">
                    Cancel
                </button>
                <button
                    disabled={title === "" || copy === "" ? true : false}
                    onClick={() => {
                        addSegment();
                    }}
                    className="disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-black px-4 py-2 bg-orange-400 rounded">
                    Submit Segment
                </button>
            </div>
        </>
    );
}
