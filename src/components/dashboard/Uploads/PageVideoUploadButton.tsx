"use client";

import { useContext, useRef } from "react";
import { DashboardStateContext } from "../DashboardStateProvider";
import { revalidateDashboard } from "@/components/server/revalidateDashboard";
import axios from "axios";

export default function PageVideoUploadButton(props: {
    check: string;
    format: string;
    target: string;
}) {
    const {
        setBackgroundNamingError,
        setVideo1NamingError,
        setVideo2NamingError,
        setSizeError,
        setNotVideoError,
        setUploading,
        setUploadProgress,
        setVideoNamingError,
    } = useContext(DashboardStateContext);

    const inputElm = useRef<HTMLInputElement>(null);

    function onSelectFile(file: File) {
        if (file) {
            const fileSize = file.size / 1024 / 1024;
            const filePrefix = file.name.split("_")[0];
            const fileType = file.type.split("/")[0];

            const nameCheck = filePrefix === props.check;
            const sizeCheck = fileSize < 100;
            const fileTypeCheck = fileType === props.format;

            if (!nameCheck) {
                switch (props.target) {
                    case "backgroundVideo":
                        setBackgroundNamingError(true);
                        break;
                    case "video":
                        setVideoNamingError(true);
                        break;
                    case "video1":
                        setVideo1NamingError(true);
                        break;
                    case "video2":
                        setVideo2NamingError(true);
                        break;
                }
            } else {
                setBackgroundNamingError(false);
                setVideo1NamingError(false);
                setVideo2NamingError(false);
                setVideoNamingError(false);
            }

            if (!sizeCheck) {
                setSizeError(true);
            } else {
                setSizeError(false);
            }

            if (!fileTypeCheck) {
                setNotVideoError(true);
            } else {
                setNotVideoError(false);
            }

            if (nameCheck && sizeCheck && fileTypeCheck) {
                uploadVideo(file);
            }
        }
    }

    async function uploadVideo(file: File) {
        setUploading(true);
        setUploadProgress(0);
        if (file.type.split("/")[0] !== "video") {
            setNotVideoError(true);
            setUploading(false);
            return;
        } else {
            const formData = new FormData();
            formData.append("file", file);
            axios
                .post("/api/video", formData, {
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
                        revalidateDashboard();
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <>
            <input
                ref={inputElm}
                onChange={(e) => {
                    if (e.target.files) {
                        onSelectFile(e.target.files[0]);
                    }
                }}
                id={"upload-showreel"}
                type="file"
                className="inputFile"
            />
            <label htmlFor={"upload-showreel"}>Upload New Video</label>
        </>
    );
}
