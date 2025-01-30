"use client";
// packages
import { useDisclosure } from "@heroui/react";
import Image from "next/image";
import { UseFormSetValue } from "react-hook-form";
// components
import SelectImageModal from "../SelectImageModal";
// types
import { SegmentFormType } from "@/lib/types";

const SegmentTopImageInput = ({
	headerImage,
	setValue,
}: Readonly<{
	headerImage: string;
	setValue: UseFormSetValue<SegmentFormType>;
}>) => {
	const { isOpen, onOpenChange } = useDisclosure();

	function handleSetValue(returnedURL: string) {
		setValue("headerImage", returnedURL, { shouldDirty: true });
	}

	if (!headerImage) {
		return (
			<div className="w-full  my-10">
				<div className="flex justify-center">
					<div className="text-center">
						<button
							type="button"
							onClick={onOpenChange}
							className="bg-orange-600 py-3 px-20 rounded shadow-xl"
						>
							Select
						</button>
					</div>
				</div>
				<SelectImageModal
					currentImage={headerImage}
					isOpen={isOpen}
					onOpenChange={onOpenChange}
					imageType="SEGHEAD"
					returnURL={handleSetValue}
				/>
			</div>
		);
	}

	return (
		<div className="relative my-2">
			<Image
				height={2000}
				width={1000}
				src={process.env.NEXT_PUBLIC_CDN + "/images/" + headerImage}
				alt={headerImage}
				className="w-full h-auto m-auto"
			/>
			<div className="hover:opacity-100 flex justify-center transition-opacity opacity-0 absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
				<div className="m-auto flex w-1/2 justify-evenly">
					<div className="w-1/2 text-center">
						<i
							onClick={onOpenChange}
							aria-hidden
							className="fa-solid cursor-pointer fa-pen-to-square fa-2xl"
						/>
					</div>
					<div className="w-1/2 text-center">
						<i
							onClick={() => {
								handleSetValue("");
							}}
							aria-hidden
							className="fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
						/>
					</div>
				</div>
			</div>
			<SelectImageModal
				currentImage={headerImage}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				imageType="SEGHEAD"
				returnURL={handleSetValue}
			/>
		</div>
	);
};

export default SegmentTopImageInput;
