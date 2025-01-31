"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Select, SelectItem } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";

const MediaOrderSelect = ({
	image,
	getOrderBy,
	setOrderBy,
}: Readonly<{
	image: boolean;
	getOrderBy?: string;
	setOrderBy?: Dispatch<SetStateAction<string>>;
}>) => {
	const { setMediaOrderBy, getMediaOrderBy } = useMediaState();

	const handleGetOrderBy = () => {
		if (getMediaOrderBy) {
			return getMediaOrderBy(image);
		} else if (getOrderBy) {
			return getOrderBy;
		}
		throw "Component needs to be in media provider or have getOrderBy props set.";
	};

	const handleSetOrderBy = (value: string) => {
		if (setMediaOrderBy) {
			return setMediaOrderBy(value, image);
		} else if (setOrderBy) {
			return setOrderBy(value);
		}
		throw "Component needs to be in media provider or have setOrderBy props set.";
	};

	return (
		<Select
			className="dark ms-auto me-auto xl:me-0"
			classNames={{
				popoverContent: "bg-neutral-600",
			}}
			variant="bordered"
			selectedKeys={[handleGetOrderBy()]}
			labelPlacement="outside"
			label={"Order"}
			onChange={(e) => handleSetOrderBy(e.target.value)}
		>
			<SelectItem className="dark" key={"asc"} value={"asc"}>
				Ascending
			</SelectItem>
			<SelectItem className="dark" key={"desc"} value={"desc"}>
				Descending
			</SelectItem>
		</Select>
	);
};

export default MediaOrderSelect;
