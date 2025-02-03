"use client";
// packages
import { Button, CircularProgress } from "@heroui/react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import axios from "axios";
// functions
import { fileCheck } from "@/lib/utils/mediaUtils/fileCheck";
import { revalidateDashboard } from "@/server/revalidateDashboard";
// constants
import { MediaType } from "@/lib/constants";
import { UploadState } from "@/lib/types";

const MediaUploadButton = ({
	mediaType,
	onOpenChange,
	returnURL,
	returnError,
	showCloseButton,
}: Readonly<{
	mediaType?: MediaType;
	onOpenChange?: () => void;
	returnURL?: (url: string) => void;
	returnError?: (error: string) => void;
	showCloseButton?: boolean;
}>) => {
	const [uploadState, setUploadState] = useState<UploadState>(
		UploadState.NONE
	);
	const [imageToUpload, setImageToUpload] = useState<File | null>(null);
	const inputField = useRef<HTMLInputElement>(null);

	const handleFileDrop = (e: DragEvent<HTMLLabelElement>) => {
		if (e.dataTransfer?.files) {
			const { success, message } = fileCheck(
				e.dataTransfer.files[0],
				mediaType
			);

			if (success) {
				setImageToUpload(e.dataTransfer.files[0]);
				setUploadState(UploadState.READY);
				return;
			}

			if (returnError) {
				returnError(message);
			}
		}
	};

	const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const { success, message } = fileCheck(
				e.target.files[0],
				mediaType
			);

			if (success) {
				setImageToUpload(e.target.files[0]);
				setUploadState(UploadState.READY);
				return;
			}

			if (returnError) {
				returnError(message);
			}
		}
	};

	const onUpload = async () => {
		setUploadState(UploadState.UPLOADING);
		if (!imageToUpload) return;
		try {
			const fileType = imageToUpload.type.split("/")[0];
			const formData = new FormData();
			formData.append("file", imageToUpload);

			const res = await axios.post(`/api/${fileType}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			setUploadState(UploadState.SUCCESS);
			revalidateDashboard();

			if (returnURL && res.data.message) {
				returnURL(res.data.message);
			}
		} catch (error) {
			setUploadState(UploadState.ERROR);
			console.log("Unexpected error:", error);
		}
	};

	const onClearFile = () => {
		if (inputField.current) {
			inputField.current.value = "";
		}
		if (returnError) {
			returnError("");
		}
		setImageToUpload(null);
		setUploadState(UploadState.NONE);
	};

	return (
		<>
			<div className="flex mt-4">
				{uploadState === UploadState.NONE && (
					<div className="flex items-center justify-center w-full">
						<label
							id="drop_zone"
							onDrop={(e: DragEvent<HTMLLabelElement>) => {
								e.preventDefault();
								handleFileDrop(e);
							}}
							onDragOver={(e) => {
								e.preventDefault();
							}}
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<svg
									className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 16"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
									/>
								</svg>
								<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
									<span className="font-semibold">
										Click to select
									</span>{" "}
									or drag and drop an image
								</p>
							</div>
							<input
								onChange={(e) => {
									handleFileSelect(e);
								}}
								id="dropzone-file"
								name="dropzone-file"
								type="file"
								className="hidden"
								aria-label="Select or drag and drop an image file"
							/>
						</label>
					</div>
				)}
				{uploadState === UploadState.ERROR && (
					<div className="flex flex-col items-center justify-center w-full">
						<div>There was an error during the upload.</div>
						<div>Please try again later.</div>
					</div>
				)}
				{uploadState === UploadState.READY && (
					<div className="flex flex-col items-center justify-center w-full gap-2 transition-all">
						<div className="font-bold text-xl">
							Ready for upload...
						</div>
						<Button
							onPress={onUpload}
							className="text-md bg-orange-500 rounded-lg p-6"
						>
							Upload {imageToUpload?.name}
						</Button>
					</div>
				)}
				{(uploadState === UploadState.UPLOADING ||
					uploadState === UploadState.SUCCESS) && (
					<div className="flex justify-center w-full gap-2 transition-all">
						<div
							className={`${
								uploadState === UploadState.SUCCESS
									? "w-32"
									: "w-0"
							} overflow-hidden transition-all text-2xl flex justify-center items-center`}
						>
							<div>Success!</div>
						</div>
						<div className="w-32 flex justify-center">
							<CircularProgress
								classNames={{
									svg: "w-28 h-28 drop-shadow-md",
									value: "text-2xl",
								}}
								showValueLabel
								value={
									uploadState === UploadState.SUCCESS
										? 100
										: undefined
								}
								color="warning"
								aria-label="Uploading..."
							/>
						</div>
					</div>
				)}
			</div>
			<div className="flex justify-between my-2">
				{showCloseButton && onOpenChange && (
					<Button
						color="danger"
						variant="light"
						className="rounded-md text-md"
						onPress={onOpenChange}
					>
						Close
					</Button>
				)}
				{uploadState !== UploadState.UPLOADING &&
					imageToUpload !== null && (
						<Button
							className="rounded-md text-md"
							onPress={onClearFile}
							color="danger"
						>
							Clear File
						</Button>
					)}
			</div>
		</>
	);
};

export default MediaUploadButton;
