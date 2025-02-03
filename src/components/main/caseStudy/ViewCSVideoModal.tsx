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
			size="5xl"
			backdrop="blur"
			isOpen={isOpen}
			className="dark transition-all"
			placement="center"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<video
							playsInline
							disablePictureInPicture
							id="bg-video"
							className="h-auto w-full fade-in"
							autoPlay={true}
							controls
							src={
								process.env.NEXT_PUBLIC_CDN +
								"/videos/" +
								videoURL
							}
						/>
						<track
							kind="captions"
							srcLang="en"
							label="English"
							default
						/>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ViewCSVideoModal;
