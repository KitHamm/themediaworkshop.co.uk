"use client";

import { Button } from "@heroui/react";
import { useContext } from "react";
import { HeaderStateContext } from "./HeaderStateProvider";
import { PageFormType } from "@/lib/types";
import { updatePage } from "@/server/pageActions/updatePage";
import { revalidateDashboard } from "@/server/revalidateDashboard";

export default function UpdatePageHeaderButton() {
	const { isDirty, handleReset } = useContext(HeaderStateContext);

	// function onSubmit(data: PageFormType) {
	// 	updatePage(data).then(() => {
	// 		revalidateDashboard();
	// 	});
	// }

	if (isDirty) {
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
	}
}
