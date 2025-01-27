"use client";

import { ImageFormType, SegmentFormType } from "@/lib/types";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
} from "@heroui/react";
import { toLink } from "@prisma/client";
import { useFieldArray, useForm } from "react-hook-form";
import SegmentTopImageInput from "./SegmentTopImageInput";
import { useEffect } from "react";
import DescriptionInput from "./DescriptionInput";
import Image from "next/image";
import AddImageArray from "./AddImageArray";
import { createSegment } from "@/server/segmentActions/createSegment";

export default function AddSegmentButtonModal(props: { pageID: number }) {
	const { pageID } = props;
	const { isOpen, onOpenChange } = useDisclosure();

	const form = useForm<SegmentFormType>({
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
		register,
		reset,
		handleSubmit,
		formState: { errors, isDirty },
		control,
		getValues,
		setValue,
		watch,
	} = form;

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

	useEffect(() => {
		if (!isOpen) reset();
	}, [isOpen]);

	function addSegment(data: SegmentFormType) {
		createSegment(data, pageID)
			.then(() => {
				onOpenChange();
			})
			.catch((err) => console.log(err));
	}

	return (
		<>
			<Button
				onPress={onOpenChange}
				className="bg-orange-600 text-white text-md rounded-md"
			>
				Add Segment
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
									{title ? title : "Unnamed Segment"}
								</div>
							</ModalHeader>

							<ModalBody className="light">
								<form
									id="segment-form"
									onSubmit={handleSubmit(addSegment)}
								>
									<div className="flex justify-between border-b pb-2">
										<div className="text-orange-600 font-bold text-xl">
											Top Image
										</div>
									</div>
									<SegmentTopImageInput
										headerImage={headerImage}
										setValue={setValue}
									/>
									<div className="xl:grid xl:grid-cols-2 xl:gap-10 mt-8">
										<div id="left-column">
											<div>
												<div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
													Title
												</div>
												<input
													{...register("title", {
														required: {
															value: true,
															message:
																"Title is required.",
														},
													})}
													placeholder={
														errors.title
															? errors.title
																	.message
															: "Title"
													}
													type="text"
													className={`${
														errors.title
															? "placeholder:text-red-400"
															: ""
													} text-black`}
												/>
											</div>
											<div className="mt-2">
												<Select
													onChange={(e) =>
														setValue(
															"linkTo",
															e.target
																.value as toLink,
															{
																shouldDirty:
																	true,
															}
														)
													}
													selectedKeys={[
														getValues("linkTo"),
													]}
													className="dark"
													variant="bordered"
													label={"Link To"}
												>
													<SelectItem
														className="text-black"
														key={"NONE"}
														value={"NONE"}
													>
														None
													</SelectItem>
													<SelectItem
														className="text-black"
														key={"FILM"}
														value={"FILM"}
													>
														Film
													</SelectItem>
													<SelectItem
														className="text-black"
														key={"DIGITAL"}
														value={"DIGITAL"}
													>
														Digital
													</SelectItem>
													<SelectItem
														className="text-black"
														key={"LIGHT"}
														value={"LIGHT"}
													>
														Light
													</SelectItem>
													<SelectItem
														className="text-black"
														key={"EVENTS"}
														value={"EVENTS"}
													>
														Events
													</SelectItem>
													<SelectItem
														className="text-black"
														key={"ART"}
														value={"ART"}
													>
														Art
													</SelectItem>
												</Select>
											</div>
											<DescriptionInput
												copy={copy}
												registerSegment={register}
												errors={errors}
											/>
											<div className="flex gap-10">
												<div className="xl:w-1/6 w-1/2">
													<div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
														Order
													</div>
													<input
														className="text-black"
														{...register("order", {
															required: {
																value: true,
																message:
																	"Please choose an order position",
															},
														})}
														type="number"
													/>
												</div>
											</div>
										</div>
										<div className="right-column">
											<div className="">
												<div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
													Images
												</div>
												<div className="grid xl:grid-cols-4 grid-cols-2 gap-4 p-2">
													{imageFields.map(
														(
															image: ImageFormType,
															index: number
														) => {
															return (
																<div
																	key={
																		image +
																		"-" +
																		index
																	}
																	className="relative"
																>
																	<Image
																		height={
																			100
																		}
																		width={
																			100
																		}
																		src={
																			process
																				.env
																				.NEXT_PUBLIC_CDN +
																			"/images/" +
																			image.url
																		}
																		alt={
																			image.url
																		}
																		className="w-full h-auto"
																	/>
																	<div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
																		<div className="text-red-400 h-full flex justify-center">
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
																</div>
															);
														}
													)}
													<AddImageArray
														imageAppendSegment={
															imageAppend
														}
													/>
												</div>
											</div>
										</div>
									</div>
								</form>
							</ModalBody>
							<ModalFooter>
								<Button
									type="button"
									color="danger"
									variant="light"
									className="rounded-md text-md"
									onPress={() => {
										onClose();
									}}
								>
									Cancel
								</Button>
								<Button
									type="button"
									color="warning"
									variant="light"
									className="rounded-md text-md"
									onPress={() => {
										reset();
									}}
								>
									Reset
								</Button>
								<Button
									form="segment-form"
									type="submit"
									disabled={
										title &&
										copy &&
										headerImage &&
										images.length > 0
											? false
											: true
									}
									className="disabled:bg-neutral-600 rounded-md bg-orange-600 text-white text-md"
								>
									Save Segment
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
