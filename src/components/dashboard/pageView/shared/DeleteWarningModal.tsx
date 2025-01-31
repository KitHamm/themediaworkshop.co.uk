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
import { useEffect } from "react";

const DeleteWarningModal = ({
	buttonText,
	onDeleteCallback,
	onCloseCallback,
	deleteError,
	type,
}: Readonly<{
	buttonText: string;
	onDeleteCallback: () => void;
	onCloseCallback: () => void;
	deleteError: string | null;
	type: "segment" | "study";
}>) => {
	const { isOpen, onOpenChange } = useDisclosure();

	const onConfirm = () => {
		onDeleteCallback();
	};

	useEffect(() => {
		if (!isOpen) onCloseCallback();
	}, [isOpen]);

	const handleOnClose = () => {
		onCloseCallback();
		onOpenChange();
	};

	const warningText =
		type === "segment"
			? "Unable to delete. Please make sure this Segment has no Case Studies."
			: "Unable to delete.";

	return (
		<>
			<Button
				type="button"
				color="danger"
				variant="light"
				onPress={onOpenChange}
				className="text-md rounded-md"
			>
				{buttonText}
			</Button>
			<Modal
				backdrop="blur"
				className="dark"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-red-400">
								WARNING
							</ModalHeader>
							<ModalBody>
								{deleteError ? (
									<p className="text-red-400">
										{warningText}
									</p>
								) : (
									<>
										<div className="text-xl">
											Are you sure you want to delete?
										</div>
										<p className="text-red-400">
											This action cannot be undone.
										</p>
									</>
								)}
							</ModalBody>
							<ModalFooter>
								{!deleteError && (
									<Button
										type="button"
										className="text-md rounded-lg"
										color="danger"
										variant="light"
										onPress={onConfirm}
									>
										Confirm Delete
									</Button>
								)}
								<Button
									type="button"
									color="danger"
									className="text-md rounded-lg"
									onPress={handleOnClose}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteWarningModal;
