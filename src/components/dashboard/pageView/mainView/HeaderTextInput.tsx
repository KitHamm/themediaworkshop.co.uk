"use client";
// context
import { usePageHeaderState } from "./HeaderStateProvider";
// types
import { PageFormType } from "@/lib/types";

const HeaderTextInput = ({
	label,
	placeholder,
	formTarget,
}: Readonly<{
	label: string;
	placeholder: string;
	formTarget: keyof PageFormType;
}>) => {
	const { register } = usePageHeaderState();

	return (
		<div>
			<div>{label}</div>
			<input
				{...register(formTarget)}
				className="text-black"
				type="text"
				placeholder={placeholder}
			/>
		</div>
	);
};

export default HeaderTextInput;
