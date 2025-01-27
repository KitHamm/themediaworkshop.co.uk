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
// components
import CaseStudyCard from "../caseStudy/CaseStudyCard";
// types
import { CaseStudy } from "@prisma/client";

const CaseStudyModal = ({
	isOpen,
	onOpenChange,
	segmentTitle,
	caseStudies,
}: Readonly<{
	isOpen: boolean;
	onOpenChange: () => void;
	segmentTitle: string | null;
	caseStudies: CaseStudy[];
}>) => {
	return (
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
	);
};

export default CaseStudyModal;
