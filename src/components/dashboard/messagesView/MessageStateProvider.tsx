"use client";
// packages
import { createContext, useContext, useMemo, useState } from "react";
// types
import { Message } from "@prisma/client";

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

const MessageStateProvider = ({
	children,
	messages,
}: Readonly<{
	children: React.ReactNode;
	messages: Message[];
}>) => {
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(
		null
	);
	const [multipleMessagesIDs, setMultipleMessagesIDs] = useState<string[]>(
		[]
	);

	const messageContextValue = useMemo(
		() => ({
			messages,
			selectedMessage,
			setSelectedMessage,
			multipleMessagesIDs,
			setMultipleMessagesIDs,
		}),
		[
			messages,
			selectedMessage,
			setSelectedMessage,
			multipleMessagesIDs,
			setMultipleMessagesIDs,
		]
	);

	return (
		<MessageStateContext.Provider value={messageContextValue}>
			{children}
		</MessageStateContext.Provider>
	);
};

export const useMessageState = () => useContext(MessageStateContext);
export default MessageStateProvider;
