"use client";
// packages
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
	const pageTitles: { title: string }[] = [{ title: "none" }, ...linkToItems];

	const handleSetValue = (value: string) => {
		setValue("linkTo", value as toLink, { shouldDirty: true });
	};

	return (
		<Select
			onChange={(e) => handleSetValue(e.target.value)}
			selectedKeys={[linkToValue]}
			className="dark"
			variant="bordered"
			label={"Link To"}
		>
			{pageTitles.map((item) => {
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
