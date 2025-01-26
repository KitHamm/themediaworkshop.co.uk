"use client";

import { CaseStudyFromType, SegmentFormType } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Markdown from "react-markdown";

export default function DescriptionInput(props: {
    copy: string;
    registerSegment?: UseFormRegister<SegmentFormType>;
    registerCaseStudy?: UseFormRegister<CaseStudyFromType>;
    errors: FieldErrors<SegmentFormType | CaseStudyFromType>;
}) {
    const { copy, registerSegment, registerCaseStudy, errors } = props;

    const [previewText, setPreviewText] = useState<boolean>(false);

    return (
        <div>
            <div className="flex gap-4 w-full border-b pb-2 mb-2 mt-6">
                <div className="text-orange-600 font-bold text-xl">
                    Description
                </div>
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
                    onClick={() => setPreviewText(!previewText)}
                    className="text-orange-600 cursor-pointer">
                    {previewText ? "Edit" : "Preview"}
                </button>
            </div>
            {previewText ? (
                <div className="min-h-52">
                    <Markdown>{copy}</Markdown>
                </div>
            ) : (
                <textarea
                    {...registerSegment?.("copy", {
                        required: {
                            value: true,
                            message: "Description is required.",
                        },
                    })}
                    {...registerCaseStudy?.("copy", {
                        required: {
                            value: true,
                            message: "Description is required.",
                        },
                    })}
                    placeholder={
                        errors.copy ? errors.copy.message : "Description"
                    }
                    className={`${
                        errors.copy ? "placeholder:text-red-400" : ""
                    } text-black h-52`}
                />
            )}
        </div>
    );
}
