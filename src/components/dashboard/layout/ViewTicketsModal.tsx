"use client";
// packages
import {
	Accordion,
	AccordionItem,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
// functions
import { revalidateDashboard } from "@/server/revalidateDashboard";
import { deleteTicket, resolveTicket } from "@/server/userActions/adminTickets";
// types
import { Tickets } from "@prisma/client";

const ViewTicketsModal = ({
	tickets,
	isOpen,
	onOpenChange,
}: Readonly<{
	tickets: Tickets[];
	isOpen: boolean;
	onOpenChange: () => void;
}>) => {
	const onDelete = async (id: string) => {
		try {
			const res = await deleteTicket(id);
			if (!res.success) {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const onResolve = async (id: string, resolved: boolean) => {
		try {
			const res = await resolveTicket(id, resolved);
			if (!res.success) {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	return (
		<Modal
			size="5xl"
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
							<div className="flex w-full gap-4">
								<div>Tickets</div>
								<div>
									<i
										onClick={() => revalidateDashboard()}
										aria-hidden
										className="cursor-pointer fa-solid my-auto fa-xl fa-arrows-rotate"
									/>
								</div>
							</div>
						</ModalHeader>
						<ModalBody>
							{tickets.length > 0 ? (
								<Accordion variant="splitted">
									{tickets.map(
										(ticket: Tickets, index: number) => {
											const message = `${ticket.from} | ${
												ticket.dashboard
													? "Dashboard"
													: "Main Page"
											} | ${
												ticket.reproducible
													? "Reproducible"
													: "Not Reproducible"
											} |`;
											return (
												<AccordionItem
													key={"ticket-" + index}
													aria-label="Accordion 1"
													title={
														<div className="flex gap-4">
															<div>{message}</div>
															<div
																className={
																	ticket.resolved
																		? "text-green-400"
																		: "text-red-400"
																}
															>
																{ticket.resolved
																	? "Closed"
																	: "Open"}
															</div>
														</div>
													}
												>
													<div>
														<div className="font-bold text-xl mb-4">
															The Problem:
														</div>
														<div>
															{ticket.description}
														</div>
														<div className="flex justify-end gap-4 mb-2">
															<Button
																onPress={() =>
																	onDelete(
																		ticket.id
																	)
																}
																color="danger"
																variant="light"
																className="text-md rounded-lg"
															>
																Delete
															</Button>
															<Button
																onPress={() =>
																	onResolve(
																		ticket.id,
																		!ticket.resolved
																	)
																}
																color={
																	ticket.resolved
																		? "danger"
																		: "success"
																}
																className="text-md rounded-lg"
															>
																{ticket.resolved
																	? "Open Ticket"
																	: "Close Ticket"}
															</Button>
														</div>
													</div>
												</AccordionItem>
											);
										}
									)}
								</Accordion>
							) : (
								<div className="text-2xl font-bold w-full text-center">
									No Tickets!
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							<Button
								onPress={onClose}
								color="danger"
								variant="light"
								className="text-md rounded-lg"
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

export default ViewTicketsModal;
