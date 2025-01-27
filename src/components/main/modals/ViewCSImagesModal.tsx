"use client";
// packages
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import Image from "next/image";
import { EmblaCarouselCaseStudyView } from "@/Embla/EmblaCarousel";

const ViewCSImagesModal = ({
	isOpen,
	onOpenChange,
	images,
}: Readonly<{
	isOpen: boolean;
	onOpenChange: () => void;
	images: string[];
}>) => {
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
							{images.length > 1 ? (
								<EmblaCarouselCaseStudyView slides={images} />
							) : (
								<Image
									width={900}
									height={500}
									src={
										process.env.NEXT_PUBLIC_CDN! +
										"/images/" +
										images[0]
									}
									alt={images[0]}
									className="w-full h-auto"
								/>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								className="rounded-md"
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

export default ViewCSImagesModal;
