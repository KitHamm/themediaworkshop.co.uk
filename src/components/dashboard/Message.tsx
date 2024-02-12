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
        <div
            className={`${
                props.hidden ? "hidden" : ""
            } xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 xl:h-screen flex flex-col`}>
            <div className="xl:py-10 w-full">
                <div className="border-b py-4 text-3xl font-bold capitalize">
                    Messages
                </div>
            </div>
            <div className="hidden h-full overflow-hidden xl:flex border-2 border-neutral-800 rounded mb-6">
                <div className="basis-2/6 overflow-y-scroll dark">
                    {messages.map((message: Message, index: number) => {
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedMessage(index);
                                    updateMessage(message.id, true);
                                }}
                                className={`${
                                    message.read
                                        ? " bg-neutral-800"
                                        : " bg-neutral-600"
                                } py-6 px-4 flex gap-6 border-b border-black cursor-pointer hover:bg-neutral-500 transition-all`}>
                                <div
                                    className={`font-bold ${
                                        message.read
                                            ? "text-neutral-600"
                                            : "text-green-400"
                                    } my-auto`}>
                                    {message.read ? "Read" : "New"}
                                </div>
                                <div>
                                    <div className="font-bold capitalize my-auto text-xl">
                                        {message.name}
                                    </div>
                                    <div className="text-sm text-neutral-400">
                                        {message.email}
                                    </div>
                                </div>
                                <div className="flex grow text-neutral-400  justify-end">
                                    {message.createdAt.toLocaleDateString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="basis-4/6 p-4">
                    {selectedMessage !== -1 ? (
                        <>
                            <div className="flex w-full gap-6 p-4">
                                <div className="font-bold">Actions:</div>
                                <div
                                    onClick={() => {
                                        onOpenChangeDeleteModal();
                                    }}
                                    className="text-red-400 cursor-pointer">
                                    Delete
                                </div>
                                <div
                                    onClick={() => {
                                        updateMessage(
                                            messages[selectedMessage].id,
                                            false
                                        );
                                        setSelectedMessage(-1);
                                    }}
                                    className="text-orange-400 cursor-pointer">
                                    Mark as unread
                                </div>
                                <a
                                    href={
                                        "mailto:" +
                                        messages[selectedMessage].email
                                    }
                                    className="text-green-400">
                                    Reply
                                </a>
                                <div className="flex grow justify-end">
                                    <div
                                        onClick={() => setSelectedMessage(-1)}
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
                                    <div className="font-bold text-base">
                                        From:
                                    </div>
                                    <div className="text-base">
                                        {messages[selectedMessage].name}
                                    </div>
                                </div>
                                <div className="flex w-full gap-2 px-4">
                                    <div className="font-bold text-base">
                                        Email:
                                    </div>
                                    <div className="text-base">
                                        {messages[selectedMessage].email}
                                    </div>
                                </div>
                            </div>
                            <div className="mx-4 mt-4 bg-white text-black rounded-lg p-4">
                                {messages[selectedMessage].message}
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full justify-center">
                            <div className="my-auto font-bold text-3xl">
                                Select a message...
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid xl:hidden xl:grid-cols-4 xl:gap-10 gap-4 xl:mt-0 mt-4">
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
