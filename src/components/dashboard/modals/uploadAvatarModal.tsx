"use client";

import { updateAvatar as updateAvatarSA } from "@/server/userActions/userAvatar";
import {
    Avatar,
    Button,
    CircularProgress,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

export default function UploadAvatarModal(props: {
    isOpen: any;
    onOpenChange: any;
    userId: string;
    userName: string;
}) {
    const [newAvatar, setNewAvatar] = useState("");
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notImageError, setNotImageError] = useState(false);

    function clearFileInput() {
        const inputElm = document.getElementById(
            "new-avatar"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    async function updateAvatar() {
        updateAvatarSA(props.userId, newAvatar)
            .then(() => {
                setNewAvatar("");
                props.onOpenChange();
            })
            .catch((err) => console.log(err));
    }

    function uploadAvatar(file: File) {
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post("/api/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ProgressEvent) => {
                    if (ProgressEvent.bytes) {
                        let percent = Math.round(
                            (ProgressEvent.loaded / ProgressEvent.total!) * 100
                        );
                        setUploadProgress(percent);
                    }
                },
            })
            .then((res) => {
                if (res.data.message) {
                    setUploading(false);
                    setNewAvatar(res.data.message);
                    clearFileInput();
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <Modal
            backdrop="blur"
            isOpen={props.isOpen}
            className="dark"
            onOpenChange={props.onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Update Avatar</ModalHeader>
                        <ModalBody>
                            {/* Show success message on successful upload of avatar */}
                            {changeSuccess ? (
                                <>
                                    <div className="text-center text-2xl font-bold">
                                        Success!
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            color="danger"
                                            onPress={() => {
                                                onClose();
                                                setNewAvatar("");
                                                setChangeSuccess(false);
                                            }}>
                                            Close
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {notImageError && (
                                        <div className="w-full flex justify-center text-red-400">
                                            File is not an image
                                        </div>
                                    )}
                                    <div className="flex">
                                        {newAvatar === "" ? (
                                            uploading ? (
                                                <div className="w-full flex justify-center">
                                                    <CircularProgress
                                                        classNames={{
                                                            svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                                            value: "text-xl",
                                                        }}
                                                        className="m-auto"
                                                        showValueLabel={true}
                                                        value={uploadProgress}
                                                        color="warning"
                                                        aria-label="Loading..."
                                                    />
                                                </div>
                                            ) : (
                                                <div className="file-input flex w-full justify-center">
                                                    <input
                                                        id="new-avatar"
                                                        className="inputFile mx-auto"
                                                        onChange={(e) => {
                                                            if (
                                                                e.target.files
                                                            ) {
                                                                if (
                                                                    e.target.files[0].type.split(
                                                                        "/"
                                                                    )[0] ===
                                                                    "image"
                                                                ) {
                                                                    setNotImageError(
                                                                        false
                                                                    );
                                                                    setUploading(
                                                                        true
                                                                    );
                                                                    uploadAvatar(
                                                                        e.target
                                                                            .files[0]
                                                                    );
                                                                } else {
                                                                    setNotImageError(
                                                                        true
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        type="file"
                                                    />
                                                    <label htmlFor="new-avatar">
                                                        {newAvatar !== ""
                                                            ? newAvatar
                                                            : "Select file"}
                                                    </label>
                                                </div>
                                            )
                                        ) : (
                                            <div className="w-full flex justify-center">
                                                <Avatar
                                                    className="w-20 h-20 text-large"
                                                    showFallback
                                                    name={props.userName}
                                                    src={
                                                        newAvatar
                                                            ? process.env
                                                                  .NEXT_PUBLIC_CDN +
                                                              "/avatars/" +
                                                              newAvatar
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <div>
                                            <Button
                                                color="danger"
                                                onPress={() => {
                                                    setNotImageError(false);
                                                    onClose();
                                                    setNewAvatar("");
                                                }}>
                                                Close
                                            </Button>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    updateAvatar();
                                                }}
                                                disabled={
                                                    newAvatar === ""
                                                        ? true
                                                        : false
                                                }
                                                className="disabled:bg-neutral-600 disabled:cursor-not-allowed bg-orange-600 px-4 py-2 rounded-lg">
                                                Save
                                            </button>
                                        </div>
                                    </div>{" "}
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
