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
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ViewCSImagesModal;
