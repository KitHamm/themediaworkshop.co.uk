"use client";

import { useContext } from "react";
import { MessageStateContext } from "./MessageStateProvider";
import { Message } from "@prisma/client";
import { updateMessage } from "@/server/messageActions/updateMessage";
import { DateRender } from "@/lib/functions";
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

export default function MobileMessageCard(props: { message: Message }) {
    const { message } = props;
    const { setSelectedMessage } = useContext(MessageStateContext);

    const { isOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
        useDisclosure();

    return (
        <>
            <div
                onClick={() => {
                    onOpenChange();
                    setSelectedMessage(message);
                    if (!message.read) {
                        updateMessage(message.id, true).catch((err) =>
                            console.log(err)
                        );
                    }
                }}
                className="cursor-pointer"
                key={message.id}>
                <div
                    className={`${
                        message.read ? "bg-neutral-800" : "bg-orange-600"
                    } rounded-lg shadow-lg p-4`}>
                    <div className="flex border-b mb-2 pb-2 justify-between">
                        <div>
                            <strong>From: </strong>
                            {message.name}
                        </div>
                        <div className="">
                            {message.read ? "Read" : "Unread"}
                        </div>
                    </div>
                    <div>
                        <strong>Received: </strong>
                        {DateRender(message.createdAt)}
                    </div>
                </div>
            </div>
            <Modal
                size="xl"
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                isDismissable={false}
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="w-full text-center font-bold text-3xl">
                                    Message
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <strong>From: </strong>
                                    {message.name}
                                </div>
                                <div>
                                    <strong>Email: </strong>
                                    {message.email}
                                </div>
                                <div>
                                    <strong>Message: </strong>
                                </div>
                                <div>{message.message}</div>
                                <div className="mt-4">
                                    <strong>Received: </strong>
                                    {DateRender(message.createdAt)}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onClick={() => {
                                        onOpenChangeDelete();
                                    }}
                                    color="danger"
                                    variant="light"
                                    className="rounded-md">
                                    Delete Message
                                </Button>
                                <Button
                                    onClick={() => {
                                        updateMessage(message.id, false)
                                            .then(() => {
                                                onClose();
                                            })
                                            .catch((err) => console.log(err));
                                    }}
                                    className="bg-orange-600 rounded-md">
                                    Mark Unread
                                </Button>
                                <Button
                                    color="danger"
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
            <Modal
                size="sm"
                backdrop="blur"
                isOpen={isOpenDelete}
                className="dark"
                isDismissable
                onOpenChange={onOpenChangeDelete}>
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
                                    onPress={() => {
                                        onClose();
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        deleteMessage(message.id)
                                            .then(() => {
                                                onClose();
                                                onOpenChange();
                                            })
                                            .catch((err) => console.log(err));
                                    }}
                                    color="danger"
                                    variant="light">
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
