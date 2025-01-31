"use client";
// context
import { useMessageState } from "./MessageStateProvider";
// functions
import { deleteMultipleMessages } from "@/server/messageActions/deleteMessage";
import { updateMultipleMessages } from "@/server/messageActions/updateMessage";

const MultipleMessageActions = () => {
	const { multipleMessagesIDs, setMultipleMessagesIDs, setSelectedMessage } =
		useMessageState();

	const onDeleteMultiple = async () => {
		try {
			const res = await deleteMultipleMessages(multipleMessagesIDs);
			if (res.success) {
				setSelectedMessage(null);
				setMultipleMessagesIDs([]);
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const onUpdateMultiple = async (value: boolean) => {
		try {
			const res = await updateMultipleMessages(
				multipleMessagesIDs,
				value
			);
			if (res.success) {
				setSelectedMessage(null);
				setMultipleMessagesIDs([]);
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	if (multipleMessagesIDs.length > 0) {
		return (
			<div className="fade-in flex gap-4">
				<div
					onClick={onDeleteMultiple}
					className="mt-auto text-lg text-red-400 cursor-pointer"
				>
					Delete {multipleMessagesIDs.length} Message(s)
				</div>
				<div
					onClick={() => {
						onUpdateMultiple(false);
					}}
					className="mt-auto text-lg text-orange-600 cursor-pointer"
				>
					Mark {multipleMessagesIDs.length} Message(s) Unread
				</div>
				<div
					onClick={() => {
						onUpdateMultiple(true);
					}}
					className="mt-auto text-lg text-green-400 cursor-pointer"
				>
					Mark {multipleMessagesIDs.length} Message(s) Read
				</div>
			</div>
		);
	}
};

export default MultipleMessageActions;
