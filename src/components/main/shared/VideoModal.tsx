"use client";
// packages
import { Modal, ModalContent, useDisclosure } from "@heroui/react";

const VideoModal = ({
	buttonText,
	videoURL,
}: Readonly<{
	buttonText: string;
	videoURL: string;
}>) => {
	const { isOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<button
				onClick={onOpenChange}
				className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 font-bold bg-orange-600 max-w-52 text-sm w-full xl:w-auto py-2 xl:px-8 xl:py-3"
			>
				{buttonText}
			</button>
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
							>
								<track
									kind="captions"
									srcLang="en"
									label="English"
									default
								/>
							</video>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default VideoModal;
