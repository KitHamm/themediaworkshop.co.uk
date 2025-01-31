"use client";
// packages
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
// context
import { useMessageState } from "./MessageStateProvider";
// functions
import { deleteMessage } from "@/server/messageActions/deleteMessage";
// types
import { Message } from "@prisma/client";

const DeleteMessageModal = ({
	message,
	isOpen,
	onOpenChange,
	onClose,
}: Readonly<{
	message: Message;
	isOpen: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}>) => {
	const { setSelectedMessage } = useMessageState();

	const onDelete = async () => {
		try {
			const res = await deleteMessage(message.id);
			if (res.success) {
				onClose();
				setSelectedMessage(null);
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	return (
		<Modal
			size="sm"
			backdrop="blur"
			isOpen={isOpen}
			className="dark"
			isDismissable
			onOpenChange={onOpenChange}
		>
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
								Are you sure you want to delete this message?
							</div>
							<div className="w-full text-center">
								This action cannot be undone.
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								className="rounded-md"
								onPress={onClose}
							>
								Cancel
							</Button>
							<Button
								onPress={onDelete}
								color="danger"
								variant="light"
								className="rounded-md"
							>
								Delete Message
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default DeleteMessageModal;
