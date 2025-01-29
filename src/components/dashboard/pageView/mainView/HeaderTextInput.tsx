"use client";
import { PageFormType } from "@/lib/types";
// context
import { usePageHeaderState } from "./HeaderStateProvider";

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
