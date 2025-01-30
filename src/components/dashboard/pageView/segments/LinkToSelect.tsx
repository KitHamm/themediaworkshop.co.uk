"use client";
// components
import { Select, SelectItem } from "@heroui/react";
import { UseFormSetValue } from "react-hook-form";
// functions
import convertToLink from "@/lib/utils/pageEditUtils/convertToLink";
// types
import { SegmentFormType } from "@/lib/types";
import { toLink } from "@prisma/client";

const LinkToSelect = ({
	linkToItems,
	setValue,
	linkToValue,
}: Readonly<{
	linkToItems: { title: string }[];
	setValue: UseFormSetValue<SegmentFormType>;
	linkToValue: string;
}>) => {
	return (
		<Select
			onChange={(e) =>
				setValue("linkTo", e.target.value as toLink, {
					shouldDirty: true,
				})
			}
			selectedKeys={[linkToValue]}
			className="dark"
			variant="bordered"
			label={"Link To"}
		>
			{linkToItems.map((item) => {
				const { capitalized, upperCase } = convertToLink(item.title);
				if (item.title === "home") return null;
				return (
					<SelectItem
						className="text-black"
						key={upperCase}
						value={upperCase}
					>
						{capitalized}
					</SelectItem>
				);
			})}
		</Select>
	);
};

export default LinkToSelect;
