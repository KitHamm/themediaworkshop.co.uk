"use client";

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";

export default function PreviewVideoModal(props: {
    isOpenPreviewVideo: boolean;
    onOpenChangePreviewVideo: any;
    previewVideo: string;
}) {
    return (
        <Modal
            size="5xl"
            backdrop="blur"
            isOpen={props.isOpenPreviewVideo}
            className="dark"
            scrollBehavior="inside"
            onOpenChange={props.onOpenChangePreviewVideo}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            <div className="w-full text-center font-bold text-3xl">
                                {props.previewVideo.split("-")[0].split("_")[1]}
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <video
                                playsInline
                                disablePictureInPicture
                                id="bg-video"
                                controls={true}
                                src={
                                    process.env.NEXT_PUBLIC_BASE_VIDEO_URL +
                                    props.previewVideo
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
