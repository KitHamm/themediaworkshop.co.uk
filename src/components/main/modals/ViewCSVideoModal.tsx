"use client";

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";

export default function ViewCSVideoModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    videoURL: string;
}) {
    const { isOpen, onOpenChange, videoURL } = props;
    return (
        <Modal
            size="4xl"
            placement="center"
            backdrop="blur"
            isOpen={isOpen}
            className="dark"
            scrollBehavior="inside"
            onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader></ModalHeader>
                        <ModalBody>
                            <video
                                playsInline
                                disablePictureInPicture
                                id="bg-video"
                                className="h-auto w-full fade-in mt-2"
                                autoPlay={true}
                                controls
                                src={
                                    process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                    videoURL
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => {
                                    onClose();
                                }}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
