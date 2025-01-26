"use client";

import MediaUploadButton from "@/components/shared/MediaUploadButton";
import { MediaType } from "@/lib/constants";
import { updateAvatar } from "@/server/userActions/userAvatar";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";

export default function UploadAvatarModal(props: {
    isOpen: any;
    onOpenChange: any;
    userId: string;
}) {
    const { isOpen, onOpenChange, userId } = props;

    function handleUpdateAvatar(url: string) {
        updateAvatar(userId, url)
            .then(() => {
                onOpenChange();
            })
            .catch((err) => console.log(err));
    }

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            className="dark"
            onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Update Avatar</ModalHeader>
                        <ModalBody>
                            <MediaUploadButton
                                returnURL={handleUpdateAvatar}
                                mediaType={MediaType.AVATAR}
                            />
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
