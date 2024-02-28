// Upload handler for media
// Takes the file to be uploaded, and the type/destination for the upload
// Video or Image or Avatar
import axios from "axios";
export default async function uploadHandler(file: File, type: string) {
    // Collect form data for the file
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
        axios
            .post(("/api/upload" as string) + type, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ProgressEvent) => {
                    if (ProgressEvent.bytes) {
                        console.log(
                            Math.round(
                                (ProgressEvent.loaded / ProgressEvent.total!) *
                                    100
                            )
                        );
                    }
                },
            })
            .then((res) => resolve(res.data))
            .catch(() => reject(0));
    });
}

// Promise for uploading the media, returning success or failure
// return new Promise((resolve, reject) => {
//     fetch(("/api/upload" as string) + type, {
//         method: "POST",
//         body: formData,
//     })
//         .then((res) => {
//             if (res.ok) {
//                 const json = res.json();
//                 resolve(json);
//             }
//         })
//         .catch(() => reject(0));
// });
