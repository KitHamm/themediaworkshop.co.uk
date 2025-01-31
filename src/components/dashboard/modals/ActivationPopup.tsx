"use client";

import { updateUserActivation } from "@/server/userActions/userActivation";
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

const ActivationPopup = ({
	activated,
	userId,
}: Readonly<{
	activated: boolean;
	userId: string;
}>) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	useEffect(() => {
		if (!activated) {
			onOpenChange();
		}
	}, []);

	const onUpdateUser = async () => {
		try {
			const res = await updateUserActivation(userId);
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
		<Modal
			backdrop="blur"
			hideCloseButton
			isDismissable={false}
			isOpen={isOpen}
			className="dark"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex text-center flex-col text-orange-600 text-2xl">
							Welcome!
						</ModalHeader>
						<ModalBody>
							<p>Welcome to the TMW Dashboard.</p>
							<p>Your account has now been activated.</p>
							<p>
								On the main dashboard you can find information
								on how best to use this service. You have the
								ability to edit, draft and publish page content
								and case study content, upload images and
								videos, and check messages received through the
								contact from on the main website.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button
								className="bg-orange-600 rounded-md"
								onPress={onUpdateUser}
							>
								Okay!
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ActivationPopup;
