"use client";

import { useContext, useState } from "react";
import { HeaderStateContext } from "./HeaderStateProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Markdown from "react-markdown";

export default function HeaderTextareaInput() {
    const { register, description } = useContext(HeaderStateContext);
    const [previewText, setPreviewText] = useState<boolean>(false);

    return (
        <>
            <div className="flex gap-4 w-full border-b pb-2 mb-2">
                <div className="">Description</div>
                <Popover className="dark" placement="right-end">
                    <PopoverTrigger>
                        <i
                            aria-hidden
                            className="fa-solid fa-circle-info fa-xl cursor-pointer my-auto"
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="text-left p-2 xl:w-96">
                            <div className="font-bold text-xl border-b pb-2 mb-2">
                                Text Info
                            </div>
                            <p className="mb-2">
                                The text is rendered using Markdown. This means
                                that you can add headers, links, and line breaks
                            </p>
                            <p className="mb-2">**Header** (bold text)</p>
                            <p className="mb-2">
                                [Link Text Here](https://link-here.com/)
                            </p>
                            <p>New line\</p>
                            <p>\</p>
                            <p>New Paragraph</p>
                        </div>
                    </PopoverContent>
                </Popover>
                <button
                    type="button"
                    onClick={() => {
                        setPreviewText(!previewText);
                    }}
                    className="text-orange-600 cursor-pointer">
                    {previewText ? "Edit" : "Preview"}
                </button>
            </div>
            {previewText ? (
                <div className="h-52">
                    <Markdown>{description}</Markdown>
                </div>
            ) : (
                <textarea
                    {...register("description")}
                    className="text-black h-52"
                />
            )}
        </>
    );
}
