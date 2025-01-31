"use client";

import MediaUploadButton from "@/components/dashboard/shared/MediaUploadButton";
import { MediaType } from "@/lib/constants";
import randomPassword from "@/lib/utils/serverUtils/createRandomPassword";
import { FormState, UserFormTypes } from "@/lib/types";
import { createUser } from "@/server/userActions/createUser";
import {
	Avatar,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddUserButtonModal = () => {
	const [formState, setFormState] = useState<FormState>(FormState.NONE);
	const [password, setPassword] = useState<string | null>();
	const [uploadError, setUploadError] = useState<string | null>(null);
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		getValues,
		setValue,
	} = useForm<UserFormTypes>({
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			position: "",
			image: "profile_placeholder.jpg",
			password: "",
			role: Role.EDITOR,
		},
	});

	const avatar = watch("image");
	const name = watch("firstName");

	const handleUploadCallback = (imageURL: string) => {
		setValue("image", imageURL);
	};

	const handleUploadError = (error: string) => {
		setUploadError(error);
	};

	const onSubmit = async (data: UserFormTypes) => {
		data.password = randomPassword(10);
		try {
			const res = await createUser(data);
			if (res.success && res.data) {
				setPassword(res.data);
				setFormState(FormState.SUCCESS);
			} else {
				console.log("Error:", res.error);
				setFormState(FormState.ERROR);
				setPassword(null);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const handleClose = () => {
		setFormState(FormState.NONE);
		reset();
		setUploadError(null);
		setPassword(null);
		onClose();
	};

	let formTitle = "Add User Account";
	if (formState === FormState.SUCCESS) {
		formTitle = "User Account Created";
	} else if (formState === FormState.ERROR) {
		formTitle = "Account with email already exists";
	}

	const getAvatarUrl = () => {
		return avatar
			? process.env.NEXT_PUBLIC_CDN + "/avatars/" + avatar
			: undefined;
	};

	const renderInput = (
		label: string,
		target: keyof UserFormTypes,
		required: boolean
	) => (
		<>
			<label key={target} className="font-bold px-2" htmlFor={target}>
				{label}
			</label>
			<input
				id={target}
				autoComplete="off"
				className={`${
					errors[target]
						? "!border-red-400 placeholder:text-red-400"
						: ""
				} `}
				placeholder={errors[target] ? errors[target].message : label}
				type="text"
				{...register(target, {
					required: {
						value: required,
						message: `${label} is required`,
					},
				})}
			/>
		</>
	);

	return (
		<>
			<Button
				className="bg-orange-600 rounded-md my-5 text-white text-md"
				onPress={onOpenChange}
			>
				Add User Account
			</Button>
			<Modal
				backdrop="blur"
				isOpen={isOpen}
				className="dark"
				isDismissable={false}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader
								className={`${
									formState === FormState.ERROR
										? "text-red-400"
										: ""
								} flex flex-col gap-1`}
							>
								{formTitle}
							</ModalHeader>
							<ModalBody>
								{formState === FormState.SUCCESS && (
									<div>
										<div className="text-center">
											Please send them their password
										</div>
										<div className="text-center bg-white text-black p-2 rounded-xl">
											{password}
										</div>
										<Button
											color="danger"
											variant="light"
											onPress={handleClose}
										>
											Close
										</Button>
									</div>
								)}

								<form onSubmit={handleSubmit(onSubmit)}>
									{formState === FormState.NONE && (
										<>
											{renderInput(
												"First Name",
												"firstName",
												true
											)}
											{renderInput(
												"Last Name",
												"lastName",
												true
											)}
											{renderInput(
												"Email",
												"email",
												true
											)}
											{renderInput(
												"Position",
												"position",
												false
											)}
											<div className="my-2 px-2 font-bold">
												Avatar
											</div>
											{uploadError && (
												<div className="w-full flex justify-center text-red-400">
													{uploadError}
												</div>
											)}
											<div className="w-full">
												{avatar ===
												"profile_placeholder.jpg" ? (
													<MediaUploadButton
														mediaType={
															MediaType.AVATAR
														}
														returnURL={
															handleUploadCallback
														}
														returnError={
															handleUploadError
														}
													/>
												) : (
													<div className="w-full flex justify-center">
														<Avatar
															className="w-20 h-20 text-large"
															showFallback
															name={name}
															src={getAvatarUrl()}
														/>
													</div>
												)}
											</div>
										</>
									)}
									<div className="flex justify-between my-4">
										<Button
											color="danger"
											variant="light"
											className="rounded-lg text-md"
											onPress={handleClose}
										>
											Cancel
										</Button>
										{formState === FormState.NONE && (
											<Button
												type="submit"
												className="bg-orange-600 rounded-lg text-md"
											>
												Submit Details
											</Button>
										)}
									</div>
								</form>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddUserButtonModal;
