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
// functions
import { deleteUser } from "@/server/userActions/deleteUser";

const DeleteUser = ({ userID, light }: { userID: string; light?: boolean }) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const onDelete = async () => {
		try {
			const res = await deleteUser(userID);
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
			<Button
				onPress={onOpenChange}
				color="danger"
				variant={light ? "light" : undefined}
				className="rounded-md mx-2"
			>
				Delete
			</Button>
			<Modal
				backdrop="blur"
				className="dark"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-red-400">
								WARNING
							</ModalHeader>
							<ModalBody>
								<p>
									Are you sure you want to delete this user?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									className="text-md rounded-lg"
									onPress={onClose}
								>
									Cancel
								</Button>
								<Button
									variant="light"
									color="danger"
									className="text-md rounded-lg"
									onPress={onDelete}
								>
									Delete User
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeleteUser;
