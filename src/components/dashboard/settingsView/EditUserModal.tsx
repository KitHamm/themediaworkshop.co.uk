"use client";

import { UserFormTypes, UserWithoutPassword } from "@/lib/types";
import { updateUser } from "@/server/userActions/updateUser";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
	useDisclosure,
} from "@heroui/react";
import { Role } from "@prisma/client";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ResetPassword from "./ResetPasswordModal";
import ChangePassword from "./ChangePasswordModal";

const EditUser = ({
	userToEdit,
	currentUser,
	light,
}: Readonly<{
	userToEdit: UserWithoutPassword;
	currentUser: UserWithoutPassword;
	light?: boolean;
}>) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<UserFormTypes>({
		defaultValues: {
			firstName: userToEdit.firstname,
			lastName: userToEdit.lastname,
			email: userToEdit.email,
			role: userToEdit.role as Role,
			position: userToEdit.position ?? "",
		},
	});

	const role = watch("role");

	const handleRoleChange = () => {
		setValue("role", role === "ADMIN" ? "EDITOR" : "ADMIN");
	};

	const onUpdateUser = async (data: UserFormTypes) => {
		try {
			const res = await updateUser(data, userToEdit.id);
			if (res.success) {
				onClose();
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	useEffect(() => {
		if (!isOpen) {
			console.log("outer closed");
		}
	}, [isOpen]);

	const renderInput = (
		label: string,
		target: keyof UserFormTypes,
		required: boolean
	) => (
		<div>
			<label htmlFor={target} className="font-bold px-2">
				{label}
			</label>
			<input
				{...register(target, {
					required: {
						value: required,
						message: `${label} is required.`,
					},
				})}
				placeholder={errors[target] ? errors[target].message : label}
				className={`${
					errors[target] && "!border-red-400 placeholder:text-red-400"
				}`}
				type="text"
			/>
		</div>
	);

	const renderPasswordButton = () => {
		if (userToEdit.id === currentUser.id) {
			return <ChangePassword adminId={currentUser.id} />;
		}

		if (currentUser.role === "ADMIN") {
			return (
				<ResetPassword
					adminId={currentUser.id}
					userId={userToEdit.id}
				/>
			);
		}

		return null;
	};

	return (
		<>
			<Button
				onPress={onOpenChange}
				color="warning"
				variant={light ? "light" : undefined}
				className="rounded-md text-orange-600 mx-2"
			>
				Edit
			</Button>
			<Modal
				backdrop="blur"
				className="dark"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-orange-600">
								Edit User
							</ModalHeader>
							<form
								id="edit-user"
								onSubmit={handleSubmit(onUpdateUser)}
							>
								<ModalBody>
									{renderInput(
										"First Name",
										"firstName",
										true
									)}
									{renderInput("Last Name", "lastName", true)}
									{renderInput("Email", "email", true)}
									{renderInput("Position", "position", false)}
									<Switch
										onChange={handleRoleChange}
										isSelected={role === "ADMIN"}
										color="warning"
									>
										Admin
									</Switch>
									<div className="mt-2">
										{renderPasswordButton()}
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										type="button"
										color="danger"
										variant="light"
										className="rounded-md"
										onPress={() => {
											onClose();
										}}
									>
										Cancel
									</Button>
									<Button
										form="edit-user"
										type="submit"
										className="bg-orange-600 rounded-md"
									>
										Save
									</Button>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>
			{/* <ResetPasswordModal
				isOpen={isOpenResetPassword}
				onOpenChange={onOpenChangeResetPassword}
				adminID={session.user.id!}
				userID={user.id}
			/>
			<ChangePasswordModal
				isOpen={isOpenChangePassword}
				onOpenChange={onOpenChangeChangePassword}
				adminID={session.user.id!}
			/> */}
		</>
	);
};

export default EditUser;
