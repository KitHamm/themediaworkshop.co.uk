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
	const { orderImages, orderVideos, setOrderImages, setOrderVideos } =
		useMediaState();

	const errorString =
		"Component needs to be in media provider or have props set.";

	const handleGetOrderBy = () => {
		if (orderImages != null && orderVideos != null) {
			return image ? orderImages : orderVideos;
		}

		if (getOrderBy) {
			return getOrderBy;
		}
		throw new Error(errorString);
	};

	const handleSetOrderBy = (value: string) => {
		if (setOrderImages != null && setOrderVideos != null) {
			return image ? setOrderImages(value) : setOrderVideos(value);
		}
		if (setOrderBy) {
			return setOrderBy(value);
		}
		throw new Error(errorString);
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
