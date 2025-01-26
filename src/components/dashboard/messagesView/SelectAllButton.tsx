"use client";

import { useContext } from "react";
import { MessageStateContext } from "./MessageStateProvider";
import { Checkbox } from "@heroui/react";

export default function SelectAllButton() {
    const { setMultipleMessagesIDs, multipleMessagesIDs, messages } =
        useContext(MessageStateContext);

    function selectAll() {
        if (multipleMessagesIDs.length === messages.length) {
            setMultipleMessagesIDs([]);
        } else {
            var temp = [];
            for (let index = 0; index < messages.length; index++) {
                temp.push(messages[index].id);
            }
            setMultipleMessagesIDs(temp);
        }
    }

    return (
        <div className="hidden xl:flex gap-2">
            <Checkbox
                color="success"
                onChange={() => selectAll()}
                isSelected={
                    multipleMessagesIDs.length > 0 &&
                    multipleMessagesIDs.length === messages.length
                }
                className="dark mb-2 ms-2">
                {multipleMessagesIDs.length > 0 &&
                multipleMessagesIDs.length === messages.length
                    ? "Unselect All"
                    : "Select All"}
            </Checkbox>
        </div>
    );
}
