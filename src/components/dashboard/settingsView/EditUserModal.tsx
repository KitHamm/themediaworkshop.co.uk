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
import { useState } from "react";
import { useForm } from "react-hook-form";
import ResetPasswordModal from "./ResetPasswordModal";
import ChangePasswordModal from "./ChangePasswordModal";

export default function EditUserModal(props: {
	isOpen: boolean;
	onOpenChange: () => void;
	session: Session;
	user: UserWithoutPassword;
}) {
	const { isOpen, onOpenChange, session, user } = props;
	const [newRole, setNewRole] = useState(user.role);

	const {
		isOpen: isOpenResetPassword,
		onOpenChange: onOpenChangeResetPassword,
	} = useDisclosure();
	const {
		isOpen: isOpenChangePassword,
		onOpenChange: onOpenChangeChangePassword,
	} = useDisclosure();

	const updateUserForm = useForm<UserFormTypes>({
		defaultValues: {
			firstName: user.firstname,
			lastName: user.lastname,
			email: user.email,
			role: user.role as Role,
			position: user.position ? user.position : "",
		},
	});
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = updateUserForm;

	function handleUpdateUser(data: UserFormTypes) {
		updateUser(data, user.id)
			.then(() => {
				setNewRole("");
				onOpenChange();
			})
			.catch((err) => console.log(err));
	}

	return (
		<>
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
							<form onSubmit={handleSubmit(handleUpdateUser)}>
								<ModalBody>
									<div>First Name:</div>
									<input
										{...register("firstName", {
											required: {
												value: true,
												message:
													"First Name is required.",
											},
										})}
										placeholder={
											errors.firstName
												? errors.firstName.message
												: "First Name"
										}
										className={
											errors.firstName
												? "placeholder:text-red-400"
												: ""
										}
										type="text"
									/>
									<div>Last Name:</div>
									<input
										{...register("lastName", {
											required: {
												value: true,
												message:
													"Last Name is required.",
											},
										})}
										placeholder={
											errors.lastName
												? errors.lastName.message
												: "Last Name"
										}
										className={
											errors.lastName
												? "placeholder:text-red-400"
												: ""
										}
										type="text"
									/>
									<div>Email:</div>
									<input
										{...register("email", {
											required: {
												value: true,
												message: "Email is required.",
											},
										})}
										placeholder={
											errors.email
												? errors.email.message
												: "Email"
										}
										className={
											errors.email
												? "placeholder:text-red-400"
												: ""
										}
										type="email"
									/>
									<div>Position:</div>
									<input
										{...register("position")}
										placeholder="Position"
										type="text"
									/>
									<Switch
										onChange={() => {
											if (newRole === "ADMIN") {
												setNewRole("EDITOR");
												setValue("role", Role.EDITOR, {
													shouldDirty: true,
												});
											} else {
												setNewRole("ADMIN");
												setValue("role", Role.ADMIN, {
													shouldDirty: true,
												});
											}
										}}
										isSelected={
											newRole === "ADMIN" ? true : false
										}
										color="warning"
									>
										Admin
									</Switch>
									{user.id === session.user.id ? (
										<div className="mt-2">
											<Button
												type="button"
												onPress={() => {
													{
														onOpenChangeChangePassword();
													}
												}}
												className="rounded-md bg-orange-600"
											>
												Change Password
											</Button>
										</div>
									) : session.user.role === "ADMIN" ? (
										<div className="mt-2">
											<Button
												type="button"
												onPress={() => {
													onOpenChangeResetPassword();
												}}
												className="rounded-md bg-orange-600"
											>
												Reset Password
											</Button>
										</div>
									) : (
										""
									)}
								</ModalBody>
								<ModalFooter>
									<Button
										type="button"
										color="danger"
										variant="light"
										className="rounded-md"
										onPress={() => {
											onClose();
											setNewRole("");
										}}
									>
										Cancel
									</Button>
									<Button
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
			<ResetPasswordModal
				isOpen={isOpenResetPassword}
				onOpenChange={onOpenChangeResetPassword}
				adminID={session.user.id!}
				userID={user.id}
			/>
			<ChangePasswordModal
				isOpen={isOpenChangePassword}
				onOpenChange={onOpenChangeChangePassword}
				adminID={session.user.id!}
			/>
		</>
	);
}
