"use client";
// packages
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";
// functions
import { createSegment } from "@/server/segmentActions/createSegment";
// components
import SegmentTopImageInput from "../SegmentTopImageInput";
import DescriptionInput from "../../shared/DescriptionInput";
import AddImageArray from "../../shared/AddImageArray";
import TitleInput from "../TitleInput";
import LinkToSelect from "../LinkToSelect";
import OrderInput from "../OrderInput";

// types
import { ImageFormType, SegmentFormType } from "@/lib/types";
import { toLink } from "@prisma/client";

const AddSegmentButtonModal = ({
	pageId,
	pageTitles,
}: Readonly<{ pageId: number; pageTitles: { title: string }[] }>) => {
	const { isOpen, onOpenChange } = useDisclosure();
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isDirty },
		control,
		setValue,
		watch,
	} = useForm<SegmentFormType>({
		defaultValues: {
			title: "",
			copy: "",
			image: [],
			video: [],
			headerImage: "",
			order: -1,
			buttonText: "",
			linkTo: toLink.NONE,
		},
	});

	const {
		fields: imageFields,
		append: imageAppend,
		remove: imageRemove,
	} = useFieldArray({
		control: control,
		name: "image",
	});

	const title = watch("title");
	const copy = watch("copy");
	const headerImage = watch("headerImage");
	const images = watch("image");
	const linkToValue = watch("linkTo");

	useEffect(() => {
		if (!isOpen) reset();
	}, [isOpen]);

	const isDisabled = () => {
		return (
			!isDirty || !title || !copy || !headerImage || images.length === 0
		);
	};

	const onSubmit = async (data: SegmentFormType) => {
		try {
			const res = await createSegment(data, pageId);
			if (res.success) {
				onOpenChange();
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	return (
		<>
			<Button
				onPress={onOpenChange}
				className="bg-orange-600 text-white text-md rounded-lg"
			>
				Add New Segment
			</Button>
			<Modal
				size="5xl"
				backdrop="blur"
				isOpen={isOpen}
				className="dark"
				scrollBehavior="inside"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<div className="w-full text-center font-bold text-3xl">
									{title || "Unnamed Segment"}
								</div>
							</ModalHeader>
							<ModalBody className="light">
								<form
									id="segment-form"
									onSubmit={handleSubmit(onSubmit)}
								>
									<div className="flex justify-between border-b pb-2">
										<div className="text-orange-600 font-bold text-xl px-2">
											Top Image
										</div>
									</div>
									<SegmentTopImageInput
										headerImage={headerImage}
										setValue={setValue}
									/>
									<div className="xl:grid xl:grid-cols-2 xl:gap-10 mt-8">
										<div id="left-column">
											<TitleInput
												target="title"
												register={register}
												errors={errors}
												label="Title"
												required
											/>
											<div className="mt-2">
												<LinkToSelect
													linkToItems={pageTitles}
													setValue={setValue}
													linkToValue={linkToValue}
												/>
											</div>
											<DescriptionInput
												copy={copy}
												registerSegment={register}
												errors={errors}
											/>
											<div className="flex gap-10">
												<div className="xl:w-2/6 w-1/2">
													<OrderInput
														target="order"
														register={register}
														label="Order"
														required
													/>
												</div>
											</div>
										</div>
										<div className="right-column">
											<div className="text-orange-600 font-bold text-xl border-b px-2 pb-2 mb-2">
												Images
											</div>
											<div className="grid xl:grid-cols-4 grid-cols-2 gap-4 p-2">
												{imageFields.map(
													(
														image: ImageFormType,
														index: number
													) => (
														<div
															key={image.url}
															className="relative"
														>
															<Image
																height={100}
																width={100}
																src={
																	process.env
																		.NEXT_PUBLIC_CDN +
																	"/images/" +
																	image.url
																}
																alt={image.url}
																className="w-full h-auto"
															/>
															<div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0 text-red-400 h-full flex justify-center">
																<i
																	onClick={() =>
																		imageRemove(
																			index
																		)
																	}
																	aria-hidden
																	className="m-auto fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
																/>
															</div>
														</div>
													)
												)}
												<AddImageArray
													imageAppendSegment={
														imageAppend
													}
												/>
											</div>
										</div>
									</div>
								</form>
							</ModalBody>
							<ModalFooter className="justify-between">
								<Button
									type="button"
									color="danger"
									variant="light"
									className="rounded-md text-md"
									onPress={onClose}
								>
									Cancel
								</Button>
								<div className="flex gap-4">
									{isDirty && (
										<Button
											type="button"
											color="warning"
											variant="light"
											className="rounded-md text-md fade-in"
											onPress={() => reset()}
										>
											Reset
										</Button>
									)}
									<Button
										form="segment-form"
										type="submit"
										isDisabled={isDisabled()}
										className="disabled:bg-neutral-600 rounded-md bg-orange-600 text-white text-md"
									>
										Save Segment
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddSegmentButtonModal;
