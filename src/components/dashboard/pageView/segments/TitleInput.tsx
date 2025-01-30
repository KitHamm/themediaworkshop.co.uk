"use client";
// packages
import { FieldErrors, UseFormRegister } from "react-hook-form";
// types
import { SegmentFormType } from "@/lib/types";

const TitleInput = ({
	target,
	register,
	errors,
	label,
	required,
}: Readonly<{
	target: keyof SegmentFormType;
	register: UseFormRegister<SegmentFormType>;
	errors: FieldErrors<SegmentFormType>;
	label: string;
	required: boolean;
}>) => {
	return (
		<>
			<div className="w-full text-orange-600 font-bold text-xl border-b px-2 pb-2 mb-2">
				{label}
			</div>

			<input
				{...register(target, {
					required: {
						value: required,
						message: `${label} is required.`,
					},
				})}
				placeholder={errors[target] ? errors[target].message : label}
				type="text"
				className={`${
					errors.title && "!border-red-400 placeholder:text-red-400"
				} text-black`}
			/>
		</>
	);
};

export default TitleInput;
