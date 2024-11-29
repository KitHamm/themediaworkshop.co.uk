"use client";

import { EmblaCarouselCaseStudyView } from "@/Embla/EmblaCarousel";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";

export default function ViewCSImagesModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    images: string[];
}) {
    const { isOpen, onOpenChange, images } = props;

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
                            {images.length > 1 ? (
                                <EmblaCarouselCaseStudyView slides={images} />
                            ) : (
                                <Image
                                    width={900}
                                    height={500}
                                    src={
                                        process.env
                                            .NEXT_PUBLIC_BASE_IMAGE_URL! +
                                        images[0]
                                    }
                                    alt={images[0]}
                                    className="w-full h-auto"
                                />
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                className="rounded-md"
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
