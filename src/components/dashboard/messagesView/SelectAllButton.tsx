"use client";
// context
import { useMessageState } from "./MessageStateProvider";
// components
import { Checkbox } from "@heroui/react";

const SelectAllButton = () => {
	const { setMultipleMessagesIDs, multipleMessagesIDs, messages } =
		useMessageState();

	const onSelectAll = () => {
		if (multipleMessagesIDs.length === messages.length) {
			setMultipleMessagesIDs([]);
		} else {
			setMultipleMessagesIDs(messages.map((message) => message.id));
		}
	};

	return (
		<div className="hidden xl:flex gap-2">
			<Checkbox
				color="success"
				onChange={onSelectAll}
				isSelected={
					multipleMessagesIDs.length > 0 &&
					multipleMessagesIDs.length === messages.length
				}
				className="dark mb-2 ms-2"
			>
				{multipleMessagesIDs.length > 0 &&
				multipleMessagesIDs.length === messages.length
					? "Unselect All"
					: "Select All"}
			</Checkbox>
		</div>
	);
};

export default SelectAllButton;
