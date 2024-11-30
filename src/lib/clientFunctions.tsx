"use client";

import { revalidateDashboard } from "@/server/revalidateDashboard";
import axios from "axios";

export async function uploadMedia(file?: File) {
    if (file) {
        var type = file.type.split("/")[0];
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post(("/api/" as string) + type, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                revalidateDashboard();
                Promise.resolve();
            })
            .catch((error) => Promise.reject(error));
    }
}

export async function deleteFile(file: string) {
    axios
        .post(
            "/api/delete",
            { fileName: file },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(() => {
            revalidateDashboard();
            Promise.resolve();
        })
        .catch((error) => {
            Promise.reject(error);
        });
}
