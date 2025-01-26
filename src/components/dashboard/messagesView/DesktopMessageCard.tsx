"use client";

import { useContext } from "react";
import { MessageStateContext } from "./MessageStateProvider";
import { Message } from "@prisma/client";
import { Checkbox } from "@heroui/react";
import { DateRender } from "@/lib/functions";
import { updateMessage } from "@/server/messageActions/updateMessage";

export default function DesktopMessageCard(props: { message: Message }) {
    const { message } = props;
    const {
        multipleMessagesIDs,
        setMultipleMessagesIDs,
        selectedMessage,
        setSelectedMessage,
    } = useContext(MessageStateContext);

    return (
        <div
            onClick={() => {
                updateMessage(message.id, true)
                    .then(() => {
                        setSelectedMessage(message);
                    })
                    .catch((err) => console.log(err));
            }}
            className={`${
                message === selectedMessage
                    ? "bg-neutral-600"
                    : message.read
                    ? " bg-neutral-800"
                    : " bg-orange-600"
            } fade-in py-6 px-4 flex gap-6 border-b border-black cursor-pointer hover:bg-neutral-500 transition-all`}>
            <div className="flex gap-2">
                <Checkbox
                    color="success"
                    isSelected={multipleMessagesIDs.includes(message.id)}
                    onChange={() => {
                        if (!multipleMessagesIDs.includes(message.id)) {
                            setMultipleMessagesIDs([
                                ...multipleMessagesIDs,
                                message.id,
                            ]);
                        } else {
                            setMultipleMessagesIDs(
                                multipleMessagesIDs.filter(
                                    (id) => id !== message.id
                                )
                            );
                        }
                    }}
                />
                <div
                    className={`font-bold ${
                        message.read ? "text-neutral-600" : "text-green-400"
                    } my-auto`}>
                    {message.read ? "Read" : "New"}
                </div>
            </div>
            <div>
                <div className="font-bold capitalize my-auto text-xl">
                    {message.name}
                </div>
                <div
                    className={`text-sm transition-all ${
                        message === selectedMessage
                            ? "text-white"
                            : "text-neutral-400"
                    }`}>
                    {message.email}
                </div>
            </div>
            <div
                className={`${
                    message === selectedMessage
                        ? "text-white"
                        : "text-neutral-400"
                } flex grow justify-end transition-all`}>
                {DateRender(message.createdAt)}
            </div>
        </div>
    );
}
