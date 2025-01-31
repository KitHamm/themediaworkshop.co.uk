"use client";
// packages
import { FieldErrors, UseFormRegister } from "react-hook-form";
// types
import { CaseStudyFromType } from "@/lib/types";

const TextInput = ({
	target,
	register,
	errors,
	label,
	required,
}: Readonly<{
	target: keyof CaseStudyFromType;
	register: UseFormRegister<CaseStudyFromType>;
	errors: FieldErrors<CaseStudyFromType>;
	label: string;
	required: boolean;
}>) => {
	return (
		<div className="mt-2">
			<div className="font-bold text-xl px-2">{label}</div>
			<input
				type="text"
				{...register(target, {
					required: {
						value: required,
						message: `${label} is required.`,
					},
				})}
				placeholder={errors[target] ? errors[target].message : label}
				className={`${
					errors[target] && "!border-red-400 placeholder:text-red-400"
				} text-black`}
			/>
		</div>
	);
};

export default TextInput;
