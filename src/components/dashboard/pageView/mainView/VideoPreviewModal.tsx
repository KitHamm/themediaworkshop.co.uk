"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import Image from "next/image";

const VideoPreview = ({ videoUrl }: Readonly<{ videoUrl: string }>) => {
	const { isOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<button
				onClick={onOpenChange}
				className="cursor-pointer m-auto border rounded p-4 flex w-1/2 my-4"
			>
				<Image
					height={100}
					width={100}
					src={"/images/play.png"}
					alt="play"
					className="w-full h-auto m-auto"
				/>
			</button>
			<Modal
				size="5xl"
				backdrop="blur"
				isOpen={isOpen}
				className="dark"
				scrollBehavior="inside"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<div className="w-full text-center font-bold text-3xl">
									{videoUrl.split("-")[0] +
										"." +
										videoUrl.split(".")[1]}
								</div>
							</ModalHeader>
							<ModalBody>
								<video
									autoPlay
									playsInline
									disablePictureInPicture
									id="bg-video"
									controls={true}
									src={
										process.env.NEXT_PUBLIC_CDN +
										"/videos/" +
										videoUrl
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button
									className="text-md rounded-lg"
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
		</>
	);
};

export default VideoPreview;
