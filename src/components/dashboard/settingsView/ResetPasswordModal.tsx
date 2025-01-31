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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// functions
import randomPassword from "@/lib/utils/serverUtils/createRandomPassword";
import { resetUserPassword } from "@/server/userActions/resetUserPassword";
// types
import { FormState, ResetUserPasswordFormType } from "@/lib/types";

const ResetPassword = ({
	adminId,
	userId,
}: Readonly<{
	adminId: string;
	userId: string;
}>) => {
	const [formState, setFormState] = useState<FormState>(FormState.NONE);
	const [passwordHidden, setPasswordHidden] = useState(true);
	const [newPassword, setNewPassword] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { isOpen, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ResetUserPasswordFormType>({
		defaultValues: {
			adminId: adminId,
			userId: userId,
		},
	});

	const onSubmit = async (data: ResetUserPasswordFormType) => {
		try {
			data.userId = userId;
			data.password = randomPassword(10);
			const res = await resetUserPassword(data);
			if (res.success && res.data) {
				setNewPassword(res.data);
				setFormState(FormState.SUCCESS);
			} else {
				console.log("Error:", res.error);
				setFormState(FormState.ERROR);
				setErrorMessage(res.error ?? "Unknown error");
			}
		} catch (error) {
			console.log("Unexpected error:", error);
			setErrorMessage("Unknown error");
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setFormState(FormState.NONE);
			setNewPassword(null);
			reset({
				adminId: adminId,
				userId: userId,
			});
		}
	}, [isOpen, setFormState, setErrorMessage, reset]);

	return (
		<>
			<Button
				onPress={onOpenChange}
				type="button"
				className="text-md rounded-lg bg-orange-600"
			>
				Reset Password
			</Button>
			<Modal
				size="xl"
				backdrop="blur"
				className="dark"
				isDismissable={false}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="text-center flex flex-col gap-1 text-red-400">
								Reset Password
							</ModalHeader>

							<ModalBody>
								{formState === FormState.SUCCESS && (
									<>
										<div className="flex flex-col text-center text-2xl text-orange-600">
											Success
										</div>
										<div className="flex flex-col text-center text-lg">
											This users password has been
											changed. They will receive an email
											with their new password shortly.
										</div>
										<div className="text-center">
											Or please send them their password
										</div>
										<div className="text-center bg-white text-black p-2 rounded-xl">
											{newPassword}
										</div>
									</>
								)}
								{formState === FormState.ERROR && (
									<>
										<div className="flex flex-col text-center text-2xl text-red-400">
											Error
										</div>
										<div className="flex flex-col text-center text-lg">
											{errorMessage}
										</div>
									</>
								)}
								<form onSubmit={handleSubmit(onSubmit)}>
									{formState === FormState.NONE && (
										<>
											<div className="flex flex-col text-center text-xl">
												Are you sure you want to reset
												this users password?
											</div>
											<div className="flex justify-between">
												<div className="mt-6">
													Enter your password to
													continue.
												</div>
												<i
													onClick={() =>
														setPasswordHidden(
															!passwordHidden
														)
													}
													aria-hidden
													className={`fa-solid my-auto cursor-pointer ${
														passwordHidden
															? "fa-eye"
															: "fa-eye-slash"
													} fa-2xl`}
												/>
											</div>
											<input
												className={`${
													errors.adminPassword &&
													"!border-red-400 placeholder:text-red-400"
												} text-center`}
												placeholder={
													errors.adminPassword
														? errors.adminPassword
																.message
														: "Password"
												}
												{...register("adminPassword", {
													required: {
														value: true,
														message:
															"Password is required.",
													},
												})}
												type={
													passwordHidden
														? "password"
														: "text"
												}
											/>
										</>
									)}
								</form>
							</ModalBody>
							<ModalFooter>
								<Button
									type="button"
									onPress={onClose}
									variant="light"
									color="danger"
									className="text-md rounded-lg"
								>
									Cancel
								</Button>
								{formState === FormState.NONE && (
									<Button
										onPress={() =>
											handleSubmit((data) =>
												onSubmit(data)
											)()
										}
										type="button"
										className="bg-orange-600 text-md rounded-lg"
									>
										Reset Password
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

export default ResetPassword;
