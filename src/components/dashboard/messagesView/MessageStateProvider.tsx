"use client";

import { Message } from "@prisma/client";
import { createContext, useState } from "react";

type MessageStateContextType = {
    messages: Message[];
    selectedMessage: Message | null;
    setSelectedMessage: (message: Message | null) => void;
    multipleMessagesIDs: string[];
    setMultipleMessagesIDs: (ids: string[]) => void;
};

export const MessageStateContext = createContext<MessageStateContextType>(
    {} as MessageStateContextType
);

export default function MessageStateProvider({
    children,
    messages,
}: {
    children: React.ReactNode;
    messages: Message[];
}) {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(
        null
    );
    const [multipleMessagesIDs, setMultipleMessagesIDs] = useState<string[]>(
        []
    );

    return (
        <MessageStateContext.Provider
            value={{
                messages,
                selectedMessage,
                setSelectedMessage,
                multipleMessagesIDs,
                setMultipleMessagesIDs,
            }}>
            {children}
        </MessageStateContext.Provider>
    );
}
