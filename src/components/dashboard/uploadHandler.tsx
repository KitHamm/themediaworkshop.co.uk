// Upload handler for media
// Takes the file to be uploaded, and the type/destination for the upload
// Video or Image or Avatar
export default async function uploadHandler(file: File, type: string) {
    // Collect form data for the file
    const formData = new FormData();
    formData.append("file", file);
    // TODO maybe check if already in database here and append name?
    // Promise for uploading the media, returning success or failure
    return new Promise((resolve, reject) => {
        fetch(("/api/upload" as string) + type, {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    resolve(1);
                }
            })
            .catch(() => reject(0));
    });
}
