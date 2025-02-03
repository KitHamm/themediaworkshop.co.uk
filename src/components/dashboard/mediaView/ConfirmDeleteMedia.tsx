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
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
// functions
import { revalidateDashboard } from "@/server/revalidateDashboard";
import { isDeleteError } from "@/lib/utils/mediaUtils/isDeleteError";
// types
import { errorResponse } from "@/lib/types";

const ConfirmDeleteMedia = ({
	onCloseMain,
	deleteErrorArray,
	setDeleteErrorArray,
	fileToDelete,
	buttonText,
}: Readonly<{
	onCloseMain: () => void;
	deleteErrorArray: errorResponse[];
	setDeleteErrorArray: Dispatch<SetStateAction<errorResponse[]>>;
	fileToDelete?: string;
	buttonText: string;
}>) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const handleClose = () => {
		setDeleteErrorArray([]);
		onClose();
		onCloseMain();
	};

	const onDelete = async () => {
		if (!fileToDelete) return;

		try {
			await axios.post(
				"/api/delete",
				{ fileName: fileToDelete },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			revalidateDashboard();
			handleClose();
		} catch (error: unknown) {
			if (isDeleteError(error)) {
				setDeleteErrorArray(error.response.data.errorArray);
			} else {
				console.log("Unexpected error:", error);
			}
		}
	};

	return (
		<>
			<Button
				className="rounded-md"
				color="danger"
				variant="light"
				onPress={onOpenChange}
			>
				{buttonText}
			</Button>
			<Modal
				size="xl"
				backdrop="blur"
				isDismissable={false}
				isOpen={isOpen}
				className="dark"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<div className="w-full flex justify-center">
									<div className="font-bold text-2xl text-red-400">
										WARNING
									</div>
								</div>
							</ModalHeader>
							<ModalBody>
								{deleteErrorArray.length > 0 ? (
									<>
										<div className="w-full text-center">
											<div className="font-bold text-red-400 text-xl">
												This file is being used!
											</div>
										</div>

										<div className="font-bold text-xl">
											Details:
										</div>
										{deleteErrorArray.map(
											(
												error: errorResponse,
												index: number
											) => {
												return (
													<div
														className="flex flex-col"
														key={"error-" + index}
													>
														<div>
															<strong>
																Used as:{" "}
															</strong>
															{error.type}
														</div>
														{error.caseTitle && (
															<div>
																<strong>
																	Case Study:{" "}
																</strong>
																{
																	error.caseTitle
																}
															</div>
														)}
														{error.segmentTitle && (
															<div>
																<strong>
																	Segment:{" "}
																</strong>
																{
																	error.segmentTitle
																}
															</div>
														)}
														{error.pageTitle && (
															<div>
																<strong>
																	Page:{" "}
																</strong>
																{
																	error.pageTitle
																}
															</div>
														)}
													</div>
												);
											}
										)}
									</>
								) : (
									<div className="w-full">
										<div className="text-center">
											Please make sure this media is not
											used on any pages before deleting.
										</div>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									className="rounded-md"
									onPress={onClose}
								>
									Cancel
								</Button>
								{deleteErrorArray.length === 0 && (
									<Button
										color="danger"
										variant="light"
										className="rounded-md"
										onPress={onDelete}
									>
										Delete Media
									</Button>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ConfirmDeleteMedia;
