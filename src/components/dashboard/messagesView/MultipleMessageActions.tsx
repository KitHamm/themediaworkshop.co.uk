"use client";

import { useContext } from "react";
import { MessageStateContext } from "./MessageStateProvider";
import { deleteMultipleMessages } from "@/server/messageActions/deleteMessage";
import { updateMultipleMessages } from "@/server/messageActions/updateMessage";

export default function MultipleMessageActions() {
    const { multipleMessagesIDs, setMultipleMessagesIDs } =
        useContext(MessageStateContext);

    function deleteMultipleMessage() {
        deleteMultipleMessages(multipleMessagesIDs)
            .then(() => {
                setMultipleMessagesIDs([]);
            })
            .catch((err) => console.log(err));
    }

    function updateMultipleMessage(value: boolean) {
        updateMultipleMessages(multipleMessagesIDs, value)
            .then(() => {
                setMultipleMessagesIDs([]);
            })
            .catch((err) => console.log(err));
    }

    if (multipleMessagesIDs.length > 0) {
        return (
            <div className="fade-in flex gap-4">
                <div
                    onClick={() => {
                        deleteMultipleMessage();
                    }}
                    className="mt-auto text-lg text-red-400 cursor-pointer">
                    Delete {multipleMessagesIDs.length} Message(s)
                </div>
                <div
                    onClick={() => {
                        updateMultipleMessage(false);
                    }}
                    className="mt-auto text-lg text-orange-600 cursor-pointer">
                    Mark {multipleMessagesIDs.length} Message(s) Unread
                </div>
                <div
                    onClick={() => {
                        updateMultipleMessage(true);
                    }}
                    className="mt-auto text-lg text-green-400 cursor-pointer">
                    Mark {multipleMessagesIDs.length} Message(s) Read
                </div>
            </div>
        );
    }
}
