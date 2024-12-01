"use client";

import { useContext } from "react";
import { MessageStateContext } from "./MessageStateProvider";
import { updateMessage } from "@/server/messageActions/updateMessage";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import { deleteMessage } from "@/server/messageActions/deleteMessage";

export default function DesktopViewMessage() {
    const { selectedMessage, setSelectedMessage } =
        useContext(MessageStateContext);

    const { isOpen, onOpenChange } = useDisclosure();

    if (selectedMessage) {
        return (
            <>
                <div className="flex w-full gap-6 p-4">
                    <div className="font-bold">Actions:</div>
                    <div
                        onClick={() => {
                            onOpenChange();
                        }}
                        className="text-red-400 cursor-pointer">
                        Delete
                    </div>
                    <div
                        onClick={() => {
                            updateMessage(selectedMessage.id, false)
                                .then(() => {
                                    setSelectedMessage(null);
                                })
                                .catch((err) => console.log(err));
                        }}
                        className="text-orange-600 cursor-pointer">
                        Mark as unread
                    </div>
                    <a
                        href={"mailto:" + selectedMessage.email}
                        className="text-green-400">
                        Reply
                    </a>
                    <div className="flex grow justify-end">
                        <div
                            onClick={() => setSelectedMessage(null)}
                            className="transition-all flex hover:bg-neutral-800 rounded-full p-1">
                            <i
                                aria-hidden
                                className="fa-regular text-neutral-400 hover:text-neutral-500 m-auto cursor-pointer text-3xl fa-circle-xmark"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex w-full gap-2 px-4">
                        <div className="font-bold text-base">From:</div>
                        <div className="text-base">{selectedMessage.name}</div>
                    </div>
                    <div className="flex w-full gap-2 px-4">
                        <div className="font-bold text-base">Email:</div>
                        <div className="text-base">{selectedMessage.email}</div>
                    </div>
                </div>
                <div className="mx-4 mt-4 bg-white text-black rounded-lg p-4">
                    {selectedMessage.message}
                </div>
                <Modal
                    size="sm"
                    backdrop="blur"
                    isOpen={isOpen}
                    className="dark"
                    isDismissable
                    onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    <div className="w-full text-center font-bold text-3xl text-red-400">
                                        WARNING
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    <div className="w-full text-center">
                                        Are you sure you want to delete this
                                        message?
                                    </div>
                                    <div className="w-full text-center">
                                        This action cannot be undone.
                                    </div>
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
                                        onClick={() => {
                                            deleteMessage(selectedMessage.id)
                                                .then(() => {
                                                    onClose();
                                                    setSelectedMessage(null);
                                                })
                                                .catch((err) =>
                                                    console.log(err)
                                                );
                                        }}
                                        color="danger"
                                        variant="light"
                                        className="rounded-md">
                                        Delete Message
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        );
    }
}
