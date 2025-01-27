"use client";
// packages
import {
	Button,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// functions
import { createMessage } from "@/server/messageActions/createMessage";
// types
import { ContactFormTypes } from "@/lib/types";
import { MessageSendingState } from "@/lib/types/pageTypes";

const socialLinks: { link: string; icon: string }[] = [
	{
		link: "https://www.instagram.com/themediaworkshopltd/",
		icon: "fa-brands fa-instagram",
	},
	{
		link: "https://vimeo.com/themediaworkshop",
		icon: "fa-brands fa-vimeo-v",
	},
	{
		link: "https://www.facebook.com/TheMediaWorkshopLtd/",
		icon: "fa-brands fa-facebook-f",
	},
	{
		link: "https://www.linkedin.com/company/themediaworkshopltd/",
		icon: "fa-brands fa-linkedin",
	},
];

const ContactModal = ({
	onOpenChange,
	isOpen,
}: {
	onOpenChange: () => void;
	isOpen: boolean;
}) => {
	const [sendingState, setSendingState] = useState<MessageSendingState>(
		MessageSendingState.NONE
	);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ContactFormTypes>();

	useEffect(() => {
		if (!isOpen) {
			reset();
		}
	}, [isOpen]);

	const onSubmit = async (data: ContactFormTypes) => {
		setSendingState(MessageSendingState.SENDING);
		try {
			const res = await createMessage(data);
			if (res.success) {
				handleSendingDelay(false);
			} else {
				console.log("Error:", res.error);
				handleSendingDelay(false);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
			handleSendingDelay(false);
		}
	};

	const handleSendingDelay = (success: boolean) => {
		setTimeout(() => {
			if (success) {
				setSendingState(MessageSendingState.SUCCESS);
				reset();
				handleResetDelay();
			} else {
				setSendingState(MessageSendingState.ERROR);
				reset();
			}
		}, 2000);
	};

	const handleResetDelay = () => {
		setTimeout(() => {
			setSendingState(MessageSendingState.NONE);
		}, 3000);
	};

	return (
		<Modal
			size="2xl"
			backdrop="blur"
			isOpen={isOpen}
			className="dark transition-all"
			placement="center"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader>
							<div className="w-full flex justify-center">
								<div className="font-bold text-3xl">
									Contact Us
								</div>
							</div>
						</ModalHeader>
						<ModalBody className="light">
							<div className="w-full">
								<div className="font-bold text-2xl">
									How can we help?
								</div>
								<p>
									Send us a message, give us a call, email us
									or get in touch on social.
								</p>
								<p>
									Let’s talk about your project and see how we
									can make some great things happen.
								</p>
								<br />
								<p>Tel: + 44 (0)845 8628456</p>
								<p>Email: info@themediaworkshop.co.uk</p>
							</div>

							<div id="form-container" className="relative">
								<div
									className={`${
										sendingState ===
										MessageSendingState.SUCCESS
											? "opacity-100"
											: "opacity-0 hidden"
									} fade-in transition-opacity absolute flex justify-center w-full h-full top-0 left-0`}
								>
									<div className="m-auto text-center">
										<div className="font-bold text-3xl mb-4">
											Message received!
										</div>
										<div>
											We will get back to you as soon as
											possible.
										</div>
									</div>
								</div>
								<div
									className={`${
										sendingState ===
										MessageSendingState.ERROR
											? "opacity-100"
											: "opacity-0 hidden"
									} fade-in transition-opacity absolute flex justify-center w-full h-full top-0 left-0`}
								>
									<div className="m-auto text-center">
										<div className="font-bold text-3xl mb-4">
											Something went wrong...
										</div>
										<div>Please try again later.</div>
										<div>
											Alternatively you can contact us via
											email or phone.
										</div>
									</div>
								</div>
								<div className="flex justify-center">
									<div className="flex justify-evenly gap-10 py-5">
										{socialLinks.map((link) => (
											<div
												key={link.link}
												className="cursor-pointer hover:text-orange-600 transition-all"
											>
												<a
													href={link.link}
													target="_blank"
													rel="noreferrer"
												>
													<i
														aria-hidden
														className={`fa-brands ${link.icon} fa-2xl`}
													/>
												</a>
											</div>
										))}
									</div>
								</div>
								<form
									className={`${
										sendingState ===
											MessageSendingState.SUCCESS ||
										sendingState ===
											MessageSendingState.ERROR
											? "opacity-0"
											: "opacity-100"
									} transition-opacity`}
									onSubmit={handleSubmit(onSubmit)}
								>
									<input
										className={`${
											errors.name
												? "placeholder:text-red-400"
												: ""
										} text-black`}
										placeholder={
											errors.name
												? errors.name.message
												: "Name"
										}
										type="text"
										{...register("name", {
											required: {
												value: true,
												message: "Name is required",
											},
										})}
									/>
									<input
										className={`${
											errors.email
												? "placeholder:text-red-400"
												: ""
										} text-black`}
										placeholder={
											errors.email
												? errors.email.message
												: "Email"
										}
										type="email"
										{...register("email", {
											required: {
												value: true,
												message: "Email is required",
											},
										})}
									/>
									<textarea
										className={`${
											errors.message
												? "placeholder:text-red-400"
												: ""
										} text-black h-auto xl:h-52`}
										placeholder={
											errors.message
												? errors.message.message
												: "Your message..."
										}
										{...register("message", {
											required: {
												value: true,
												message:
													"You should probably write something here...",
											},
										})}
									/>
									<div className="flex justify-between pb-4">
										<Button
											type="button"
											color="danger"
											variant="light"
											className="text-md rounded-lg"
											onPress={onClose}
										>
											Close
										</Button>
										{sendingState ===
										MessageSendingState.SENDING ? (
											<CircularProgress
												className="fade-in"
												color="warning"
												aria-label="Loading..."
											/>
										) : (
											<Button
												className="text-white text-md bg-orange-600 rounded-lg"
												type="submit"
											>
												Send Message
											</Button>
										)}
									</div>
								</form>
							</div>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ContactModal;
