"use client";

import { useContext } from "react";
import { HeaderStateContext } from "./HeaderStateProvider";

export default function HeaderTextInput(props: {
    label: string;
    placeholder: string;
    formTarget:
        | "header"
        | "subTitle"
        | "videoOneButtonText"
        | "videoTwoButtonText";
}) {
    const { register } = useContext(HeaderStateContext);
    const { label, placeholder, formTarget } = props;
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
}
