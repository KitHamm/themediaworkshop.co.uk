"use client";
// packages
import { UseFormRegister } from "react-hook-form";
// types
import { SegmentFormType } from "@/lib/types";

const OrderInput = ({
	target,
	register,
	label,
	required,
}: Readonly<{
	target: keyof SegmentFormType;
	register: UseFormRegister<SegmentFormType>;
	label: string;
	required: boolean;
}>) => {
	return (
		<>
			<div className="text-orange-600 font-bold text-xl border-b px-2 pb-2 mb-2">
				{label}
			</div>
			<input
				className="text-black"
				{...register(target, {
					required: {
						value: required,
						message: `${label} is required.`,
					},
				})}
				type="number"
			/>
		</>
	);
};

export default OrderInput;
