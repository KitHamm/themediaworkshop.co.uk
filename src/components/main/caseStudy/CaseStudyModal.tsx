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
// components
import CaseStudyCard from "../caseStudy/CaseStudyCard";
// types
import { CaseStudy } from "@prisma/client";

const CaseStudyModal = ({
	segmentTitle,
	caseStudies,
	buttonText,
}: Readonly<{
	segmentTitle: string | null;
	caseStudies: CaseStudy[];
	buttonText: string;
}>) => {
	const { isOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<div className="xl:text-center">
				<button
					onClick={onOpenChange}
					className="transition-all hover:bg-opacity-0 hover:text-orange-600 border border-orange-600 bg-opacity-90 mb-6 xl:mb-0 px-4 py-2 bg-orange-600"
				>
					{buttonText}
				</button>
			</div>
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
								<div className="text-3xl w-full text-center">
									{segmentTitle}
								</div>
							</ModalHeader>
							<ModalBody>
								{caseStudies.map(
									(casestudy: CaseStudy, index: number) => (
										<CaseStudyCard
											key={casestudy.id}
											caseStudy={casestudy}
											index={index}
										/>
									)
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
		</>
	);
};

export default CaseStudyModal;
