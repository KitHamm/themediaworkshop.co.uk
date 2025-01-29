"use client";
// packages
import { useDisclosure } from "@heroui/react";
// context
import { useMessageState } from "./MessageStateProvider";
// functions
import { updateMessage } from "@/server/messageActions/updateMessage";
// components
import DeleteMessageModal from "./DeleteMessageModal";

const DesktopViewMessage = () => {
	const { selectedMessage, setSelectedMessage } = useMessageState();

	const { isOpen, onOpenChange, onClose: onCloseModal } = useDisclosure();

	if (!selectedMessage) return null;

	const onUpdateMessage = async () => {
		try {
			const res = await updateMessage(selectedMessage.id, false);
			if (res.success) {
				setSelectedMessage(null);
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const onCloseMessage = () => {
		setSelectedMessage(null);
	};

	return (
		<>
			<div className="flex w-full gap-6 p-4">
				<div className="font-bold">Actions:</div>
				<div
					onClick={onOpenChange}
					className="text-red-400 cursor-pointer"
				>
					Delete
				</div>
				<div
					onClick={onUpdateMessage}
					className="text-orange-600 cursor-pointer"
				>
					Mark as unread
				</div>
				<a
					href={"mailto:" + selectedMessage.email}
					className="text-green-400"
				>
					Reply
				</a>
				<div className="flex grow justify-end">
					<div
						onClick={onCloseMessage}
						className="transition-all flex hover:bg-neutral-800 rounded-full p-1"
					>
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
			<DeleteMessageModal
				message={selectedMessage}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onCloseModal}
			/>
		</>
	);
};

export default DesktopViewMessage;
