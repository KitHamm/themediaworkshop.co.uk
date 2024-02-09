"use client";

// Library Components
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

// React Components
import { useEffect, useState } from "react";

// Types
import { Message } from "@prisma/client";

export default function Messages(props: {
    hidden: boolean;
    revalidateDashboard: any;
    messages: Message;
}) {
    // State for all messages once received
    const [messages, setMessages] = useState<Message[]>([]);
    // State for the selected message to view in modal
    const [selectedMessage, setSelectedMessage] = useState(-1);
    // Modal declarations
    // Message view modal
    const {
        isOpen: isOpenMessageModal,
        onOpen: onOpenMessageModal,
        onOpenChange: onOpenChangeMessageModal,
    } = useDisclosure();
    // Message delete warning modal
    const {
        isOpen: isOpenDeleteModal,
        onOpen: onOpenDeleteModal,
        onOpenChange: onOpenChangeDeleteModal,
    } = useDisclosure();

    // Collect initial messages
    useEffect(() => {
        setMessages(props.messages);
    }, [props.messages]);

    async function deleteMessage(id: string) {
        await fetch("/api/deletemessage", {
            method: "POST",
            body: JSON.stringify({ id: id }),
        })
            .then((res) => {
                if (res.ok) {
                    props.revalidateDashboard("/dashboard");
                    setSelectedMessage(-1);
                }
            })
            .catch((err: any) => console.log(err));
    }

    async function updateMessage(id: string, value: boolean) {
        await fetch("/api/updatemessage", {
            method: "POST",
            body: JSON.stringify({ id: id, value: value }),
        })
            .then((res) => {
                if (res.ok) {
                    props.revalidateDashboard("/");
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={`${props.hidden ? "hidden" : ""} mx-20 fade-in`}>
            <div className="my-10">
                <div className="border-b py-4 text-3xl font-bold capitalize">
                    Messages
                </div>
            </div>
            <div className="grid grid-cols-4 gap-10">
                {messages.map((message: Message, index: number) => {
                    return (
                        <div
                            onClick={() => {
                                onOpenChangeMessageModal();
                                setSelectedMessage(index);
                                if (!message.read) {
                                    updateMessage(message.id, true);
                                }
                            }}
                            className="cursor-pointer"
                            key={message.id}>
                            <div
                                className={`${
                                    message.read
                                        ? "bg-neutral-800"
                                        : "bg-orange-400"
                                } rounded-lg shadow-lg p-4`}>
                                <div className="flex border-b mb-2 pb-2 justify-end">
                                    <div className="">
                                        {message.read ? "Read" : "Unread"}
                                    </div>
                                </div>
                                <div>
                                    <strong>From: </strong>
                                    {message.name}
                                </div>
                                <div>
                                    <strong>Received: </strong>
                                    {new Date(
                                        message.createdAt
                                    ).toLocaleDateString("en-US")}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Message view modal */}
            <Modal
                size="xl"
                backdrop="blur"
                isOpen={isOpenMessageModal}
                className="dark"
                isDismissable={false}
                onOpenChange={onOpenChangeMessageModal}>
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
                                    {messages[selectedMessage].name}
                                </div>
                                <div>
                                    <strong>Email: </strong>
                                    {messages[selectedMessage].email}
                                </div>
                                <div>
                                    <strong>Message: </strong>
                                </div>
                                <div>{messages[selectedMessage].message}</div>
                                <div className="mt-4">
                                    <strong>Received: </strong>
                                    {new Date(
                                        messages[selectedMessage].createdAt
                                    ).toLocaleDateString("en-US")}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onClick={() => {
                                        onOpenChangeDeleteModal();
                                        onClose();
                                    }}
                                    color="danger"
                                    variant="light">
                                    Delete
                                </Button>
                                <Button
                                    onClick={() => {
                                        updateMessage(
                                            messages[selectedMessage].id,
                                            false
                                        );
                                        onClose();
                                        setSelectedMessage(-1);
                                    }}
                                    className="bg-orange-400">
                                    Mark Unread
                                </Button>
                                <Button
                                    color="danger"
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
            {/* Delete message warning modal */}
            <Modal
                size="sm"
                backdrop="blur"
                isOpen={isOpenDeleteModal}
                className="dark"
                isDismissable
                onOpenChange={onOpenChangeDeleteModal}>
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
                                    onClick={() => {
                                        onClose();
                                        deleteMessage(
                                            messages[selectedMessage].id
                                        );
                                    }}
                                    color="danger"
                                    variant="light">
                                    Delete
                                </Button>

                                <Button
                                    color="danger"
                                    onPress={() => {
                                        onClose();
                                        setSelectedMessage(-1);
                                    }}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
