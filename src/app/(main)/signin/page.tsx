"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { CircularProgress } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

type FormTypes = {
	email: string;
	password: string;
};

export default function SignIn() {
	// Contact from declaration
	const form = useForm<FormTypes>();
	const { register, handleSubmit, formState, reset } = form;
	const { errors } = formState;
	// Loading State
	const [loading, setLoading] = useState(false);
	// Error State
	const [signInError, setSignInError] = useState(false);
	// Show password state
	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = async (data: FormTypes) => {
		setLoading(true);
		try {
			const res = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});
			if (res?.ok) {
				window.location.href = "/dashboard";
			} else {
				setLoading(false);
				setSignInError(true);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSignInError(true);
		}
	};

	return (
		<div className="bg-black flex justify-center w-screen h-screen">
			<div className="fade-in xl:w-1/5 my-auto bg-neutral-400 bg-opacity-15 py-10 px-10 backdrop-blur-sm xl:rounded-xl">
				<Image
					width={800}
					height={200}
					src={"/images/tmw-logo.png"}
					alt="logo"
					className="w-full h-auto mb-6"
				/>
				{signInError ? (
					<div className="font-bold text-center text-red-400 mb-4 text-xl">
						Incorrect email or password
					</div>
				) : (
					<div className="font-bold text-center text-orange-600 mb-4 text-xl">
						Sign In
					</div>
				)}

				<form className="dark" onSubmit={handleSubmit(onSubmit)}>
					<input
						className={`${
							errors.email ? "placeholder:text-red-400" : ""
						}`}
						placeholder={
							errors.email ? errors.email.message : "Email"
						}
						type="email"
						{...register("email", {
							required: {
								value: true,
								message: "Email is required.",
							},
						})}
					/>
					<input
						className={`${
							errors.password ? "placeholder:text-red-400" : ""
						}`}
						placeholder={
							errors.password
								? errors.password.message
								: "Password"
						}
						type={showPassword ? "text" : "password"}
						{...register("password", {
							required: {
								value: true,
								message: "Password is required.",
							},
						})}
					/>
					<div className="flex justify-between mt-2">
						<button type="button" onClick={() => reset()}>
							<i
								aria-hidden
								className="fa-solid fa-rotate-left fa-lg"
							/>
						</button>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
						>
							<i
								aria-hidden
								className={`${
									showPassword ? "fa-eye-slash" : "fa-eye"
								} fa-solid fa-lg`}
							/>
						</button>
					</div>
					{loading ? (
						<div className="fade-in flex justify-center mt-6">
							<CircularProgress
								classNames={{
									track: "text-orange-600",
									indicator: "text-orange-600",
								}}
								aria-label="Signing In..."
							/>
						</div>
					) : (
						<div className="flex justify-center gap-2 mt-4">
							<button
								type="submit"
								className="w-full bg-orange-600 rounded py-3 uppercase text-3xl"
							>
								Sign In
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
