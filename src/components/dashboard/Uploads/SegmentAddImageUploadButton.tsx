"use client";

import axios from "axios";
import { DashboardStateContext } from "../DashboardStateProvider";
import { useContext } from "react";

export default function SegmentAddImageUploadButton(props: {
    onOpenChange: any;
    imageAppend: any;
    check: string;
    format: string;
}) {
    const {
        setSegmentImageNamingError,
        setSizeError,
        setNotImageError,
        setUploading,
        setUploadProgress,
    } = useContext(DashboardStateContext);
    function onSelectFile(file: File) {
        if (file) {
            const fileSize = file.size / 1024 / 1024;
            const filePrefix = file.name.split("_")[0];
            const fileType = file.type.split("/")[0];

            const nameCheck = filePrefix === props.check;
            const sizeCheck = fileSize < 100;
            const fileTypeCheck = fileType === props.format;

            if (!nameCheck) {
                setSegmentImageNamingError(true);
            } else {
                setSegmentImageNamingError(false);
            }

            if (!sizeCheck) {
                setSizeError(true);
            } else {
                setSizeError(false);
            }

            if (!fileTypeCheck) {
                setNotImageError(true);
            } else {
                setNotImageError(false);
            }

            if (nameCheck && sizeCheck && fileTypeCheck) {
                uploadImage(file);
            }
        }
    }

    async function uploadImage(file: File) {
        setUploading(true);
        setUploadProgress(0);
        if (file.type.split("/")[0] !== "image") {
            setNotImageError(true);
            setUploading(false);
            return;
        } else {
            const formData = new FormData();
            formData.append("file", file);
            axios
                .post("/api/image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (ProgressEvent) => {
                        if (ProgressEvent.bytes) {
                            let percent = Math.round(
                                (ProgressEvent.loaded / ProgressEvent.total!) *
                                    100
                            );
                            setUploadProgress(percent);
                        }
                    },
                })
                .then((res) => {
                    if (res.data.message) {
                        setUploading(false);
                        props.imageAppend({
                            url: res.data.message,
                        });
                        props.onOpenChange();
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <div className="file-input shadow-xl">
            <input
                onChange={(e) => {
                    if (e.target.files) {
                        onSelectFile(e.target.files[0]);
                        // if (
                        //     namingConventionCheck(
                        //         e.target.files[0].name,
                        //         "SEGMENT"
                        //     )
                        // ) {
                        //     setSegmentImageNamingError(false);
                        //     setUploading(true);
                        //     uploadImage(e.target.files[0], "image");
                        // } else {
                        //     setSegmentImageNamingError(true);
                        //     clearFileInput("SEGMENT");
                        // }
                    }
                }}
                id={"image-input"}
                type="file"
                className="inputFile"
            />
            <label htmlFor={"image-input"}>Upload New Image</label>
        </div>
    );
}
