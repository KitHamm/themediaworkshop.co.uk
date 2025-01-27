"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";

const ViewCSVideoModal = ({
	isOpen,
	onOpenChange,
	videoURL,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	videoURL: string;
}) => {
	return (
		<Modal
			size="4xl"
			placement="center"
			backdrop="blur"
			isOpen={isOpen}
			className="dark"
			scrollBehavior="inside"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader></ModalHeader>
						<ModalBody>
							<video
								playsInline
								disablePictureInPicture
								id="bg-video"
								className="h-auto w-full fade-in mt-2"
								autoPlay={true}
								controls
								src={
									process.env.NEXT_PUBLIC_CDN +
									"/videos/" +
									videoURL
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={() => {
									onClose();
								}}
							>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ViewCSVideoModal;
