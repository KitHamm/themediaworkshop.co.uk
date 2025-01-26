"use client";

import { uploadMedia } from "@/lib/clientFunctions";
import { MediaType } from "@/lib/constants";
import { onSelectFile } from "@/lib/functions";
import { Button, CircularProgress } from "@heroui/react";
import { useRef, useState } from "react";

export default function MediaUploadButton(props: {
    mediaType?: MediaType;
    onOpenChange?: () => void;
    returnURL?: (url: string) => void;
    returnError?: (error: string) => void;
}) {
    const { mediaType, onOpenChange, returnURL, returnError } = props;
    const [newUpload, setNewUpload] = useState<File>();
    const [uploading, setUploading] = useState(false);
    const inputField = useRef<HTMLInputElement>(null);

    function handleFileSelect(file: File, mediaType?: MediaType) {
        onSelectFile(file, mediaType)
            .then((res) => {
                setNewUpload(file);
                if (returnError) {
                    returnError(res.message);
                }
            })
            .catch((error) => {
                if (returnError) {
                    returnError(error.message);
                }
            });
    }

    function handleUpload() {
        if (newUpload) {
            uploadMedia(newUpload)
                .then((res) => {
                    if (res.status === 201) {
                        setUploading(false);
                        clearFileInput();
                        if (returnURL && res.message) {
                            returnURL(res.message);
                        }
                        if (onOpenChange) {
                            onOpenChange();
                        }
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function clearFileInput() {
        if (inputField.current) {
            inputField.current.value = "";
        }
        setNewUpload(undefined);
        if (returnError) {
            returnError("");
        }
    }

    return (
        <>
            <div className="flex mx-auto mt-4">
                {uploading ? (
                    <CircularProgress
                        classNames={{
                            svg: "w-28 h-28 drop-shadow-md",
                            value: "text-2xl",
                        }}
                        color="warning"
                        aria-label="Loading..."
                        className="ms-4"
                    />
                ) : (
                    <div className="file-input">
                        <input
                            ref={inputField}
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleFileSelect(
                                        e.target.files[0],
                                        mediaType
                                    );
                                }
                            }}
                            className="inputFile"
                            type="file"
                            name={"uploader"}
                            id={"uploader"}
                        />
                        <label className="m-auto" htmlFor="uploader">
                            {newUpload !== undefined ? "Change" : "Select file"}
                        </label>
                        <div className="text-center mt-4">
                            {newUpload !== undefined
                                ? newUpload.name
                                : "Max size: 100MB"}
                        </div>
                    </div>
                )}
            </div>
            {!uploading && (
                <div className="flex justify-evenly">
                    <Button
                        className="rounded-md"
                        onPress={() => {
                            clearFileInput();
                        }}
                        color="danger">
                        Clear
                    </Button>
                    <Button
                        onPress={() => {
                            setUploading(true);
                            handleUpload();
                        }}
                        disabled={newUpload ? false : true}
                        className="rounded-md disabled:cursor-not-allowed disabled:bg-neutral-800 bg-orange-600 ">
                        Upload
                    </Button>
                </div>
            )}
        </>
    );
}
