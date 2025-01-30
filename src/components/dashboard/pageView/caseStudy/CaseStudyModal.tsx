"use client";
// packages
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
// functions
import { createCaseStudy } from "@/server/caseStudyActions/createCaseStudy";
import { updateCaseStudy } from "@/server/caseStudyActions/updateCaseStudy";
// types
import { CaseStudy } from "@prisma/client";
import {
	CaseStudyFromType,
	CaseStudyTagType,
	ImageFormType,
} from "@/lib/types";
import DescriptionInput from "../DescriptionInput";
import AddImageArray from "../shared/AddImageArray";
import VideoSelect from "../../shared/VideoSelect";

const CaseStudyModal = ({
	caseStudy,
	segmentId,
}: Readonly<{ caseStudy?: CaseStudy; segmentId: number }>) => {
	const { isOpen, onOpenChange } = useDisclosure();

	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		reset,
		formState: { isDirty, errors },
	} = useForm<CaseStudyFromType>({
		defaultValues: {
			id: caseStudy?.id ?? null,
			segmentId: segmentId,
			title: caseStudy?.title ?? "",
			dateLocation: caseStudy?.dateLocation ?? "",
			copy: caseStudy?.copy ?? "",
			image: caseStudy?.image.map((img) => ({ url: img })) ?? [],
			video: caseStudy?.video ?? "",
			videoThumbnail: caseStudy?.videoThumbnail ?? "",
			tags: caseStudy?.tags.map((tag) => ({ text: tag })) ?? [],
			order: caseStudy?.order ?? -1,
			published: caseStudy?.published ?? false,
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
	const {
		fields: tagsFields,
		append: tagsAppend,
		remove: tagsRemove,
	} = useFieldArray({
		control: control,
		name: "tags",
	});

	const title = watch("title");
	const copy = watch("copy");
	const currentVideo = watch("video");
	const videoThumbnail = watch("videoThumbnail");
	const published = watch("published");
	const [newTag, setNewTag] = useState<string | null>(null);

	const onSubmit = async (data: CaseStudyFromType) => {
		const submitAction = caseStudy ? updateCaseStudy : createCaseStudy;
		try {
			const res = await submitAction(data);
			if (res.success) {
				onOpenChange();
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const openButton = caseStudy ? (
		<Button
			type="button"
			onPress={onOpenChange}
			color={caseStudy.published ? "success" : "warning"}
			className="rounded-md text-white text-md"
		>
			{caseStudy.title}
		</Button>
	) : (
		<Button
			type="button"
			onPress={onOpenChange}
			className="my-auto rounded-md text-white text-md bg-orange-600"
		>
			Add Case Study
		</Button>
	);

	return (
		<>
			{openButton}
			<Modal
				size="5xl"
				backdrop="blur"
				isOpen={isOpen}
				className="dark"
				isDismissable={false}
				scrollBehavior="outside"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<div className="w-full text-center text-3xl font-bold text-orange-600">
									{title ? title : "Unnamed Case Study"}
								</div>
							</ModalHeader>
							<ModalBody className="light">
								<div className="grid xl:grid-cols-2 gap-10">
									<div id="left">
										<div className="font-bold text-xl px-2">
											Title:
										</div>
										<input
											type="text"
											{...register("title", {
												required: {
													value: true,
													message:
														"Title is requited.",
												},
											})}
											placeholder={
												errors.title
													? errors.title.message
													: "Title"
											}
											className={
												errors.title
													? "placeholder:text-red-400"
													: "text-black"
											}
										/>
										<div className="font-bold text-xl px-2 mt-2">
											Date/Location:
										</div>
										<input
											type="text"
											className="text-black"
											{...register("dateLocation")}
										/>
										<div className="flex justify-between mt-5">
											<div className="font-bold text-xl px-2 mt-auto">
												Tags:
											</div>
											<em className="my-auto text-neutral-600">
												Click a tag to remove it
											</em>
										</div>
										<div className="flex flex-wrap gap-4 mt-2">
											{tagsFields.map(
												(
													tag: CaseStudyTagType,
													index: number
												) => {
													return (
														<Chip
															onClick={() =>
																tagsRemove(
																	index
																)
															}
															className="cursor-pointer"
															key={
																tag.text +
																"-" +
																index
															}
														>
															{tag.text}
														</Chip>
													);
												}
											)}
										</div>
										<div className="font-bold text-xl px-2 mt-5">
											New Tag:
										</div>
										<div className="flex gap-4">
											<input
												className="text-black"
												type="text"
												placeholder="Add a new Tag"
												value={newTag ?? ""}
												onChange={(e) => {
													setNewTag(e.target.value);
												}}
											/>

											<Button
												type="button"
												onPress={() => {
													if (newTag) {
														tagsAppend({
															text: newTag,
														});
														setNewTag("");
													}
												}}
												className="bg-orange-600 rounded-md my-auto text-white"
											>
												Add
											</Button>
										</div>
									</div>
									<div id="right">
										<DescriptionInput
											copy={copy}
											registerCaseStudy={register}
											errors={errors}
										/>
										<div className="font-bold text-xl px-2 mt-5">
											Order:
										</div>
										<div className="w-1/2">
											<input
												className="text-black"
												type="number"
												{...register("order")}
											/>
										</div>
									</div>
								</div>
								<div className="grid xl:grid-cols-2 mt-4 gap-10">
									<div id="left">
										<div className="min-h-[33%]">
											<div className="font-bold text-xl px-2 pb-2 mb-2 border-b border-neutral-400">
												Images:
											</div>
											<div className="grid xl:grid-cols-4 grid-cols-2 gap-4 p-2">
												{imageFields.map(
													(
														image: ImageFormType,
														index: number
													) => {
														const imageUrl =
															process.env
																.NEXT_PUBLIC_CDN +
															"/images/" +
															image.url;
														return (
															<div
																key={image.url}
																className="relative"
															>
																<Image
																	height={100}
																	width={100}
																	src={
																		imageUrl
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
													imageAppendCaseStudy={
														imageAppend
													}
												/>
											</div>
										</div>
									</div>
									<div id="right">
										<div className="h-1/3 flex justify-between gap-2">
											<div className="basis-1/2">
												<div className="font-bold text-xl px-2 pb-2 mb-2 border-b border-neutral-400">
													Video:
												</div>
												<VideoSelect
													setValueCaseStudy={setValue}
													currentVideo={currentVideo}
												/>
											</div>
											<div className="basis-1/2">
												<div className="font-bold text-xl px-2 pb-2 mb-2 border-b border-neutral-400">
													Thumbnail:
												</div>
												{videoThumbnail ? (
													<div className="relative">
														<Image
															height={100}
															width={100}
															src={
																process.env
																	.NEXT_PUBLIC_CDN +
																"/images/" +
																videoThumbnail
															}
															alt={videoThumbnail}
															className="w-full h-auto"
														/>
														<div className="hover:opacity-100 opacity-0 transition-opacity absolute w-full h-full bg-black bg-opacity-75 top-0 left-0">
															<div className="text-red-400 h-full flex justify-center">
																<i
																	onClick={() =>
																		setValue(
																			"videoThumbnail",
																			""
																		)
																	}
																	aria-hidden
																	className="m-auto fa-solid cursor-pointer fa-trash fa-2xl text-red-400"
																/>
															</div>
														</div>
													</div>
												) : (
													<AddImageArray
														currentImage={
															videoThumbnail
														}
														setValue={setValue}
													/>
												)}
											</div>
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter>
								{caseStudy && (
									<Button
										type="button"
										color="danger"
										variant="light"
										className="rounded-md"
										onPress={() => {}}
									>
										Delete Case Study
									</Button>
								)}
								<Button
									type="button"
									color="warning"
									variant="light"
									className="rounded-md"
									onPress={() => {
										reset();
									}}
								>
									Reset
								</Button>
								<Button
									type="button"
									color="danger"
									className="rounded-md"
									onPress={() => {
										onClose();
										reset();
									}}
								>
									Cancel
								</Button>
								{caseStudy && (
									<Button
										type="button"
										color={published ? "danger" : "success"}
										className="rounded-md"
										onPress={() => {}}
									>
										{published ? "Unpublish" : "Publish"}
									</Button>
								)}
								<Button
									type="button"
									onPress={() =>
										handleSubmit((data) => onSubmit(data))()
									}
									className="bg-orange-600 text-white rounded-md"
								>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default CaseStudyModal;
