"use client";
// packages
import { useState, useEffect } from "react";
import { Checkbox } from "@heroui/react";
// context
import { useMessageState } from "./MessageStateProvider";
// functions
import { updateMessage } from "@/server/messageActions/updateMessage";
import { formatDate } from "@/lib/utils/dateUtils/formatDate";
// types
import { Message } from "@prisma/client";

const DesktopMessageCard = ({ message }: Readonly<{ message: Message }>) => {
	const {
		multipleMessagesIDs,
		setMultipleMessagesIDs,
		selectedMessage,
		setSelectedMessage,
	} = useMessageState();

	const [messageCardClass, setMessageCardClass] = useState("bg-neutral-600");
	const [isSelected, setIsSelected] = useState(false);

	useEffect(() => {
		if (message === selectedMessage) {
			setMessageCardClass("bg-neutral-500");
		} else if (!message.read) {
			setMessageCardClass("bg-orange-600");
		} else {
			setMessageCardClass("bg-neutral-600");
		}
	}, [message, selectedMessage, setMessageCardClass]);

	useEffect(() => {
		if (multipleMessagesIDs.includes(message.id)) {
			setIsSelected(true);
		} else {
			setIsSelected(false);
		}
	}, [multipleMessagesIDs, message.id]);

	const onOpenMessage = async (messageRead: boolean) => {
		if (messageRead) {
			return setSelectedMessage(message);
		}

		try {
			const res = await updateMessage(message.id, true);
			if (res.success) {
				setSelectedMessage(message);
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const onSelectMessage = () => {
		if (!multipleMessagesIDs.includes(message.id)) {
			setMultipleMessagesIDs([...multipleMessagesIDs, message.id]);
		} else {
			setMultipleMessagesIDs(
				multipleMessagesIDs.filter((id) => id !== message.id)
			);
		}
	};

	return (
		<button
			onClick={() => onOpenMessage(message.read)}
			className={`${messageCardClass} text-start fade-in py-6 px-4 flex gap-6 border-b border-black w-full hover:bg-neutral-500 transition-all`}
		>
			<div className="flex gap-2">
				<Checkbox
					color="success"
					isSelected={isSelected}
					onChange={onSelectMessage}
				/>
				<div
					className={`font-bold ${
						message.read ? "text-neutral-600" : "text-green-400"
					} my-auto`}
				>
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
					}`}
				>
					{message.email}
				</div>
			</div>
			<div
				className={`${
					message === selectedMessage
						? "text-white"
						: "text-neutral-400"
				} flex grow justify-end transition-all`}
			>
				{formatDate(message.createdAt)}
			</div>
		</button>
	);
};

export default DesktopMessageCard;
