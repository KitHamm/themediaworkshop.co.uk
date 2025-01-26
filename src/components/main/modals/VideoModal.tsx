"use client";

import { Modal, ModalContent } from "@heroui/react";

export default function VideoModal(props: {
    videoURL: string;
    isOpen: boolean;
    onOpenChange: () => void;
}) {
    const { isOpen, onOpenChange, videoURL } = props;
    return (
        <Modal
            size="5xl"
            backdrop="blur"
            isOpen={isOpen}
            className="dark transition-all"
            placement="center"
            onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <video
                            playsInline
                            disablePictureInPicture
                            className="-z-10"
                            autoPlay={true}
                            autoFocus={false}
                            id="bg-video"
                            controls={true}
                            src={
                                process.env.NEXT_PUBLIC_CDN +
                                "/videos/" +
                                videoURL
                            }
                        />
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
