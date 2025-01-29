"use client";
// packages
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
// context
import { useMessageState } from "./MessageStateProvider";
// functions
import { updateMessage } from "@/server/messageActions/updateMessage";
import { formatDate } from "@/lib/utils/dateUtils/formatDate";
// components
import DeleteMessageModal from "./DeleteMessageModal";
// types
import { Message } from "@prisma/client";

const MobileMessageCard = ({ message }: Readonly<{ message: Message }>) => {
	const { setSelectedMessage } = useMessageState();
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const {
		isOpen: isOpenDelete,
		onOpenChange: onOpenChangeDelete,
		onClose: onCloseDelete,
	} = useDisclosure();

	const handleOpen = () => {
		setSelectedMessage(message);
		onOpenChange();
	};

	const onOpenMessage = async (messageRead: boolean) => {
		if (messageRead) {
			return handleOpen();
		}
		try {
			const res = await updateMessage(message.id, true);
			if (res.success) {
				handleOpen();
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const onUpdateRead = async () => {
		try {
			const res = await updateMessage(message.id, false);
			if (res.success) {
				onClose();
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	return (
		<>
			<button
				onClick={() => onOpenMessage(message.read)}
				className="cursor-pointer text-left"
				key={message.id}
			>
				<div
					className={`${
						message.read ? "bg-neutral-800" : "bg-orange-600"
					} rounded-lg shadow-lg p-4`}
				>
					<div className="flex border-b mb-2 pb-2 justify-between">
						<div className="flex gap-2">
							<div className="font-bold">From:</div>
							<div>{message.name}</div>
						</div>
						<div>{message.read ? "Read" : "Unread"}</div>
					</div>
					<div className="flex gap-2">
						<div className="font-bold">Received:</div>
						<div>{formatDate(message.createdAt)}</div>
					</div>
				</div>
			</button>
			<Modal
				size="xl"
				backdrop="blur"
				isOpen={isOpen}
				className="dark"
				isDismissable={false}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<div className="w-full text-center font-bold text-3xl">
									Message
								</div>
							</ModalHeader>
							<ModalBody>
								<div className="flex gap-2">
									<div className="font-bold">From:</div>
									<div>{message.name}</div>
								</div>
								<div className="flex gap-2">
									<div className="font-bold">Email:</div>
									<div>{message.email}</div>
								</div>
								<div>
									<div className="font-bold">Message:</div>
								</div>
								<div>{message.message}</div>
								<div className="flex gap-2 mt-4">
									<div className="font-bold">Received:</div>
									<div>{formatDate(message.createdAt)}</div>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button
									onPress={onOpenChangeDelete}
									color="danger"
									variant="light"
									className="rounded-md"
								>
									Delete Message
								</Button>
								<Button
									onPress={onUpdateRead}
									className="bg-orange-600 rounded-md"
								>
									Mark Unread
								</Button>
								<Button
									color="danger"
									className="rounded-md"
									onPress={onClose}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<DeleteMessageModal
				message={message}
				isOpen={isOpenDelete}
				onOpenChange={onOpenChangeDelete}
				onClose={onCloseDelete}
			/>
		</>
	);
};

export default MobileMessageCard;
