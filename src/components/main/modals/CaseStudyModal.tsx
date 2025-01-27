"use client";
// packages
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
// components
import { EmblaCarouselCaseStudyInner } from "@/Embla/EmblaCarousel";
// types
import { CaseStudy } from "@prisma/client";
import CaseStudyCard from "../caseStudy/CaseStudyCard";

const CaseStudyModal = ({
	isOpen,
	onOpenChange,
	segmentTitle,
	caseStudies,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
	segmentTitle: string | null;
	caseStudies: CaseStudy[];
}) => {
	const copyText = useRef<HTMLDivElement[]>([]);

	useEffect(() => {
		if (copyText.current.length > 0) {
			for (let i = 0; i < copyText.current.length; i++) {
				const anchors: HTMLAnchorElement[] = [];
				for (
					let j = 0;
					j < copyText.current[i].children[0].children.length;
					j++
				) {
					if (
						copyText.current[i].children[0].children[j].tagName ===
						"A"
					)
						anchors.push(
							copyText.current[i].children[0].children[
								j
							] as HTMLAnchorElement
						);
				}
				for (let k = 0; k < anchors.length; k++) {
					anchors[k].setAttribute("target", "_blank");
					anchors[k].setAttribute("rel", "noreferrer");
				}
			}
		}
	}, []);

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
