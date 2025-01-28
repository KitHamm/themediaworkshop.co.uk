"use client";

import { TicketFormType } from "@/lib/types";
import { createTicket } from "@/server/userActions/adminTickets";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CreateTicketModal = ({
	isOpen,
	onOpenChange,
	userName,
}: Readonly<{
	isOpen: boolean;
	onOpenChange: () => void;
	userName: string;
}>) => {
	const [ticketSuccess, setTicketSuccess] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TicketFormType>({
		defaultValues: {
			dashboard: false,
			reproducible: false,
			submittedBy: userName,
		},
	});

	const isDashboard = watch("dashboard");
	const isReproducible = watch("reproducible");

	const onSubmit = async (data: TicketFormType) => {
		try {
			const res = await createTicket(data);
			if (res.success) {
				setTicketSuccess(true);
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	useEffect(() => {
		if (!isOpen) {
			reset({
				dashboard: false,
				reproducible: false,
				problem: "",
				submittedBy: userName,
			});
			setTicketSuccess(false);
		}
	}, [isOpen]);

	return (
		<Modal
			backdrop="blur"
			isOpen={isOpen}
			className="dark"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>Ticket Submission</ModalHeader>
						<form onSubmit={handleSubmit(onSubmit)}>
							<ModalBody>
								{ticketSuccess ? (
									<div className="w-full text-xl text-green-400 text-center">
										Ticket Successfully Submitted!
									</div>
								) : (
									<>
										<div className="text-lg">
											Where is the problem?
										</div>
										<div className="flex gap-2">
											<div
												className={`${
													!isDashboard &&
													"text-orange-600"
												}
                                                transition-all`}
											>
												Main Site
											</div>
											<Switch
												color="default"
												isSelected={isDashboard}
												onChange={(e) => {
													setValue(
														"dashboard",
														!isDashboard
													);
												}}
											>
												<div
													className={`
                                                    ${
														isDashboard &&
														"text-orange-600"
													}
                                                    transition-all`}
												>
													Dashboard
												</div>
											</Switch>
										</div>
										<div className="text-lg">
											Is it easily reproducible?
										</div>
										<Switch
											color="success"
											isSelected={isReproducible}
											onChange={() => {
												setValue(
													"reproducible",
													!isReproducible
												);
											}}
										>
											<div>
												{isReproducible ? "Yes" : "No"}
											</div>
										</Switch>
										<div className="text-lg">
											Describe the problem...
										</div>
										<textarea
											{...register("problem", {
												required: {
													value: true,
													message:
														"Please describe the problem.",
												},
											})}
											placeholder={
												errors.problem
													? errors.problem.message
													: "Type here..."
											}
											className={`${
												errors.problem
													? "placeholder:text-red-400"
													: ""
											} min-h-52`}
										/>
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<Button
									type="button"
									onPress={onClose}
									color="danger"
									variant="light"
									className="text-md rounded-lg"
								>
									Close
								</Button>
								{!ticketSuccess && (
									<Button
										type="submit"
										className="bg-orange-600 text-md rounded-lg"
									>
										Submit Ticket
									</Button>
								)}
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default CreateTicketModal;
