"use client";

import { deleteUser } from "@/server/userActions/deleteUser";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";

export default function DeleteUserWarningModal(props: {
    isOpen: boolean;
    onOpenChange: () => void;
    userID: string;
}) {
    const { isOpen, onOpenChange, userID } = props;

    function handleDeleteUser() {
        deleteUser(userID).then(() => {
            onOpenChange();
        });
    }

    return (
        <Modal
            backdrop="blur"
            className="dark"
            isOpen={isOpen}
            onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-red-400">
                            WARNING
                        </ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to delete this user?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                className="rounded-md"
                                onPress={() => {
                                    onClose();
                                }}>
                                Cancel
                            </Button>
                            <Button
                                variant="light"
                                color="danger"
                                className="rounded-md"
                                onPress={() => {
                                    handleDeleteUser();
                                }}>
                                Delete User
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
