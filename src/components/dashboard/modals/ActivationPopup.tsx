"use client";

import { updateUserActivation } from "@/server/userActions/userActivation";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect } from "react";

export default function ActivationPopup(props: {
    activated: boolean;
    userID: string;
}) {
    const { activated, userID } = props;
    const { isOpen, onOpenChange } = useDisclosure();

    // Initial pop up if this is the first log in
    useEffect(() => {
        if (!activated) {
            onOpenChange();
        }
    }, []);

    // Set user as active on dismissing the initial pop up
    async function updateUser() {
        updateUserActivation(userID).catch((err) => {
            console.log(err);
        });
    }

    return (
        <Modal
            isDismissable={false}
            isOpen={isOpen}
            className="dark"
            onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex text-center flex-col text-orange-600 text-2xl">
                            Welcome!
                        </ModalHeader>
                        <ModalBody>
                            <p>Welcome to the TMW Dashboard.</p>
                            <p>Your account has now been activated.</p>
                            <p>
                                On the main dashboard you can find information
                                on how best to use this service. You have the
                                ability to edit, draft and publish page content
                                and case study content, upload images and
                                videos, and check messages received through the
                                contact from on the main website.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="bg-orange-600 rounded-md"
                                onPress={() => {
                                    onClose();
                                    updateUser();
                                }}>
                                Okay!
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
