"use client";
// packages
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
// functions
import { updateAvatar } from "@/server/userActions/userAvatar";
// components
import MediaUploadButton from "@/components/dashboard/shared/MediaUploadButton";
// types
import { MediaType } from "@/lib/constants";

const ChangeAvatarModal = ({
	userId,
	isOpen,
	onOpenChange,
}: Readonly<{ userId: string; isOpen: boolean; onOpenChange: () => void }>) => {
	const onUpdateAvatar = async (image: string) => {
		try {
			const res = await updateAvatar(userId, image);
			if (res.success) {
				onOpenChange();
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
			isOpen={isOpen}
			className="dark"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>Update Avatar</ModalHeader>
						<ModalBody>
							<MediaUploadButton
								returnURL={onUpdateAvatar}
								mediaType={MediaType.AVATAR}
								showCloseButton
								onOpenChange={onOpenChange}
							/>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ChangeAvatarModal;
