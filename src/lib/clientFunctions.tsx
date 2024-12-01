"use client";

import { revalidateDashboard } from "@/server/revalidateDashboard";
import axios from "axios";

export function uploadMedia(file?: File): Promise<{ status: number }> {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject({ error: "No file provided" });
        }

        const type = file.type.split("/")[0];
        const formData = new FormData();
        formData.append("file", file);

        axios
            .post(`/api/${type}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
                if (res.status === 201) {
                    revalidateDashboard();
                    resolve({ status: 201 });
                } else {
                    reject({
                        error: "Unexpected status code",
                        status: res.status,
                    });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function deleteFile(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}
