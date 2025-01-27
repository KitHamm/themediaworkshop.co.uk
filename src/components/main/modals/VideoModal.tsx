"use client";
// packages
import { Modal, ModalContent } from "@heroui/react";

const VideoModal = ({
	videoURL,
	isOpen,
	onOpenChange,
}: Readonly<{
	videoURL: string;
	isOpen: boolean;
	onOpenChange: () => void;
}>) => {
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
				{() => (
					<>
						<video
							playsInline
							disablePictureInPicture
							className="-z-10"
							autoPlay={true}
							autoFocus={false}
							id="bg-video"
							controls={true}
							src={
								process.env.NEXT_PUBLIC_CDN +
								"/videos/" +
								videoURL
							}
						/>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default VideoModal;
