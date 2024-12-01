"use client";

import MediaUploadButton from "@/components/shared/MediaUploadButton";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

export default function MediaUploadButtonModal() {
    const { isOpen, onOpenChange } = useDisclosure();
    const [uploadError, setUploadError] = useState<string | null>(null);

    function handleReturnError(error: string) {
        if (error !== "success") {
            setUploadError(error);
        } else {
            setUploadError(null);
        }
    }

    return (
        <>
            <Button
                onClick={onOpenChange}
                className="rounded-md text-md text-white bg-orange-600">
                Upload Media
            </Button>
            <Modal
                hideCloseButton
                size="2xl"
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                isDismissable={false}
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-center">
                                Upload New Media
                            </ModalHeader>
                            <ModalBody>
                                <div className="mx-auto">
                                    <div className="text-center text-2xl font-bold">
                                        Naming Conventions
                                    </div>
                                    <div className="px-4 xl:text-base text-sm">
                                        <div className=" mt-4">
                                            When uploading new media please
                                            follow these naming conventions to
                                            make sure the media is served in the
                                            correct way and is visible on all
                                            areas of the site.
                                        </div>
                                        <div className="mt-2">
                                            All files should be prefixed with
                                            the correct keyword (listed below)
                                            and contain no other special
                                            characters. Specifically hyphens (-)
                                        </div>
                                        <div className="mt-2">
                                            <strong>For example:</strong>{" "}
                                            HEADER_NameOfImage.ext
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
                                                    Images
                                                </div>
                                                <div>
                                                    <strong>
                                                        Section Headers:{" "}
                                                    </strong>
                                                    SEGHEAD_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Section Images:{" "}
                                                    </strong>
                                                    SEGMENT_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Case Study Images:{" "}
                                                    </strong>
                                                    STUDY_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Logo Images:{" "}
                                                    </strong>
                                                    LOGO_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Video Thumbnail:{" "}
                                                    </strong>
                                                    THUMBNAIL_
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xl border-b border-neutral-400 py-2 mb-2 font-bold mt-2">
                                                    Videos
                                                </div>
                                                <div>
                                                    <strong>
                                                        Background Videos:{" "}
                                                    </strong>
                                                    HEADER_
                                                </div>
                                                <div>
                                                    <strong>
                                                        Other Videos:{" "}
                                                    </strong>
                                                    VIDEO_
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {uploadError && (
                                    <div className="text-center text-red-400">
                                        {uploadError}
                                    </div>
                                )}

                                {isOpen && (
                                    <MediaUploadButton
                                        onOpenChange={onOpenChange}
                                        returnError={handleReturnError}
                                    />
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="rounded-md"
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        setUploadError(null);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
