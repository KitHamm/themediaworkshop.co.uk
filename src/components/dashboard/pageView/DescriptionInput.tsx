"use client";
// packages
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Markdown from "react-markdown";
// types
import { CaseStudyFromType, SegmentFormType } from "@/lib/types";

const DescriptionInput = ({
	copy,
	registerSegment,
	registerCaseStudy,
	errors,
}: Readonly<{
	copy: string;
	registerSegment?: UseFormRegister<SegmentFormType>;
	registerCaseStudy?: UseFormRegister<CaseStudyFromType>;
	errors: FieldErrors<SegmentFormType | CaseStudyFromType>;
}>) => {
	if (registerSegment === undefined && registerCaseStudy === undefined) {
		throw new Error(
			"Component needs to be in segment form context or set register and errors props"
		);
	}
	const registerHandler =
		(registerSegment as UseFormRegister<SegmentFormType>) ??
		(registerCaseStudy as UseFormRegister<CaseStudyFromType>)!;

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
					className="text-orange-600 cursor-pointer"
				>
					{previewText ? "Edit" : "Preview"}
				</button>
			</div>
			{previewText ? (
				<div className="min-h-52">
					<Markdown>{copy}</Markdown>
				</div>
			) : (
				<textarea
					{...registerHandler("copy", {
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
};

export default DescriptionInput;
