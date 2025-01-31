"use client";
// packages
import { Button } from "@heroui/react";
// context
import { usePageHeaderState } from "./HeaderStateProvider";

const UpdatePageHeaderButton = () => {
	const { isDirty, handleReset } = usePageHeaderState();

	if (!isDirty) return null;

	return (
		<div className="fade-in flex gap-4">
			<div className="my-auto text-red-400 font-bold text-lg">
				Unsaved Changes
			</div>
			<Button
				type="button"
				color="warning"
				variant="light"
				onPress={handleReset}
				className="text-md rounded-md"
			>
				Discard
			</Button>
			<Button
				type="submit"
				className="bg-orange-600 text-white text-md rounded-md"
			>
				Save Changes
			</Button>
		</div>
	);
};

export default UpdatePageHeaderButton;
