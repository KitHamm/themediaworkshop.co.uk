"use client";
// context
import { useMediaState } from "./MediaStateProvider";
// packages
import { Button } from "@heroui/react";

const selectionOptions: {
	label: string;
	value: "SEGHEAD" | "SEGMENT" | "STUDY" | "THUMBNAIL" | "LOGO";
}[] = [
	{ label: "Header", value: "SEGHEAD" },
	{ label: "Segment", value: "SEGMENT" },
	{ label: "Case Study", value: "STUDY" },
	{ label: "Thumbnail", value: "THUMBNAIL" },
	{ label: "Logos", value: "LOGO" },
];

const ImageViewButtons = () => {
	const { imageView, setImageView } = useMediaState();
	return (
		<>
			{selectionOptions.map((option) => (
				<Button
					key={option.value}
					onPress={() => setImageView(option.value)}
					className={`${
						imageView === option.value
							? "bg-orange-600"
							: "bg-neutral-600"
					} rounded-md text-white text-md transition-all`}
				>
					{option.label}
				</Button>
			))}
		</>
	);
};

export default ImageViewButtons;
