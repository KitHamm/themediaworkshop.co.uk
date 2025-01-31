"use client";
// packages
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// functions
import { changePassword } from "@/server/userActions/changePassword";
// types
import { FormState, UserPasswordFormTypes } from "@/lib/types";

const ChangePassword = ({
	adminId,
}: Readonly<{
	adminId: string;
}>) => {
	const [formState, setFormState] = useState<FormState>(FormState.NONE);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [passwordHidden, setPasswordHidden] = useState(true);
	const { isOpen, onOpenChange } = useDisclosure();
	const {
		getValues,
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<UserPasswordFormTypes>();

	const onSubmit = async (data: UserPasswordFormTypes) => {
		data.id = adminId;
		try {
			const res = await changePassword(data);
			if (res.success) {
				setFormState(FormState.SUCCESS);
			} else {
				console.log("Error:", res.error);
				setFormState(FormState.ERROR);
				if (res.error) {
					setErrorMessage(res.error);
				}
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setFormState(FormState.NONE);
			setErrorMessage(null);
			reset();
		}
	}, [isOpen, setFormState, setErrorMessage, reset]);

	return (
		<>
			<Button
				type="button"
				onPress={onOpenChange}
				className="text-md rounded-lg bg-orange-600"
			>
				Change Password
			</Button>

			<Modal
				backdrop="blur"
				className="dark"
				hideCloseButton
				isDismissable={false}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="text-center flex flex-col gap-1 text-orange-600">
								Change Password
							</ModalHeader>
							<ModalBody>
								{formState === FormState.SUCCESS && (
									<>
										<div className="flex flex-col text-center text-2xl text-orange-600">
											Success
										</div>
										<div className="flex flex-col text-center text-lg">
											Your password has been changed.
											Please log out and log back in with
											your new password.
										</div>
										<div className="flex justify-end my-4">
											<Button
												onPress={() =>
													signOut({
														callbackUrl:
															"/dashboard",
													})
												}
												className="bg-orange-600 text-md rounded-lg"
											>
												Log Out
											</Button>
										</div>
									</>
								)}
								{formState === FormState.ERROR && (
									<>
										<div className="flex flex-col text-center text-2xl text-red-600">
											Error
										</div>
										<div className="flex flex-col text-center text-lg">
											{errorMessage}
										</div>
									</>
								)}
								<form>
									{formState === FormState.NONE && (
										<>
											<div className="flex justify-between">
												<div className="font-bold text-xl mt-4">
													New password
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
												{...register("password", {
													required: {
														value: true,
														message:
															"New Password is required",
													},
												})}
												className={
													errors.password
														? "placeholder:text-red-400"
														: ""
												}
												placeholder={
													errors.password
														? errors.password
																.message
														: "New Password"
												}
												id="new-password"
												type={
													passwordHidden
														? "password"
														: "text"
												}
											/>

											<div className="font-bold text-xl mt-4">
												Confirm password
											</div>
											<input
												{...register(
													"confirmPassword",
													{
														validate: (value) =>
															value ===
																getValues(
																	"password"
																) ||
															"Passwords do not match.",
													}
												)}
												placeholder="Confirm New Password"
												id="confirm-new-password"
												type={
													passwordHidden
														? "password"
														: "text"
												}
											/>
											{errors.confirmPassword && (
												<p className="text-red-400">
													{
														errors.confirmPassword
															.message
													}
												</p>
											)}
											<div className="font-bold text-xl mt-4">
												Current Password
											</div>
											<input
												{...register(
													"currentPassword",
													{
														required: {
															value: true,
															message:
																"Current Password is required",
														},
													}
												)}
												className={
													errors.currentPassword
														? "placeholder:text-red-400"
														: ""
												}
												placeholder={
													errors.currentPassword
														? errors.currentPassword
																.message
														: "Current password"
												}
												id="current-password"
												type={
													passwordHidden
														? "password"
														: "text"
												}
											/>
										</>
									)}
									{formState !== FormState.SUCCESS && (
										<div className="flex justify-end my-4 gap-4">
											<Button
												type="button"
												variant="light"
												color="danger"
												className="text-md rounded-lg"
												onPress={() => {
													onClose();
													reset();
												}}
											>
												Cancel
											</Button>
											{formState === FormState.NONE && (
												<Button
													type="button"
													onPress={() =>
														handleSubmit((data) =>
															onSubmit(data)
														)()
													}
													className="bg-orange-600 text-md rounded-lg"
												>
													Submit Changes
												</Button>
											)}
										</div>
									)}
								</form>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ChangePassword;
