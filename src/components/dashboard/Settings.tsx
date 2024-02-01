"use client";

import { useState } from "react";

export default function Settings(props: { hidden: boolean }) {
    const [title, setTitle] = useState("");

    async function handleSubmit() {
        const response = await fetch("api/addpage", {
            method: "POST",
            body: JSON.stringify({ title: title }),
        })
            .then((response) => {
                if (response.ok) {
                    setTitle("");
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20`}>
            <div className="my-10 border-b py-4 text-3xl font-bold capitalize">
                Settings
            </div>
            <div className="font-bold text-xl">Add Page</div>
            <div className="xl:grid xl:grid-cols-3">
                <div>
                    <label htmlFor="page-name">Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title for the page"
                        className="text-black"
                        id="page-name"
                        name="page-name"
                        type="text"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={title === "" ? true : false}
                        className="rounded bg-orange-400 px-4 py-2 disabled:bg-neutral-400 disabled:cursor-not-allowed">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
