"use client";

import axios from "axios";
import { DashboardStateContext } from "../DashboardStateProvider";
import { useContext, useRef } from "react";
import { revalidateDashboard } from "@/server/revalidateDashboard";

export default function SegmentTopImageUploadButton(props: {
    check: string;
    format: string;
    setValue: any;
    setTopImage: any;
    onOpenChange: any;
}) {
    const {
        setTopImageNamingError,
        setImageNamingError,
        setSizeError,
        setNotImageError,
        setUploadProgress,
        setUploading,
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
                setTopImageNamingError(true);
                setImageNamingError(true);
            } else {
                setTopImageNamingError(false);
                setImageNamingError(false);
            }

            if (!sizeCheck) {
                setSizeError(true);
                inputElm.current!.value = "";
            } else {
                setSizeError(false);
            }

            if (!fileTypeCheck) {
                setNotImageError(true);
                inputElm.current!.value = "";
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
                        props.setValue("headerImage", res.data.message, {
                            shouldDirty: true,
                        });
                        props.setTopImage(res.data.message);
                        props.onOpenChange();
                        revalidateDashboard();
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <div className="file-input">
            <input
                ref={inputElm}
                onChange={(e) => {
                    if (e.target.files) {
                        onSelectFile(e.target.files[0]);
                    }
                }}
                id={"upload-image"}
                type="file"
                className="inputFile"
            />
            <label htmlFor={"upload-image"}>Upload New Image</label>
        </div>
    );
}
