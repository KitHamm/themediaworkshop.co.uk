"use client";

import { CaseStudyFromType, ImageFormType } from "@/lib/types";
import { CaseStudy } from "@prisma/client";
import { set, useFieldArray, useForm } from "react-hook-form";
import { CaseStudyImageType, CaseStudyTagType } from "@/lib/types";
import { useEffect, useState } from "react";
import { createCaseStudy } from "@/server/caseStudyActions/createCaseStudy";
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
import DescriptionInput from "./DescriptionInput";
import AddImageArray from "./AddImageArray";
import Image from "next/image";
import VideoSelect from "./VideoSelect";
import {
	updateCaseStudy,
	updateCaseStudyPublished,
} from "@/server/caseStudyActions/updateCaseStudy";
import { deleteCaseStudy } from "@/server/caseStudyActions/deleteCaseStudy";

export default function CaseStudyModal(props: {
	isOpen: boolean;
	onOpenChange: () => void;
	segmentID: number;
	caseStudy?: CaseStudy;
}) {
	const { segmentID, caseStudy, isOpen, onOpenChange } = props;

	const {
		isOpen: isOpenDeleteWarning,
		onOpenChange: onOpenChangeDeleteWarning,
	} = useDisclosure();

	const newCaseStudyForm = useForm<CaseStudyFromType>({
		defaultValues: {
			segmentId: segmentID,
		},
	});

	function handleReset() {
		reset({
			title: caseStudy?.title ?? "",
			dateLocation: caseStudy?.dateLocation ?? "",
			copy: caseStudy?.copy ?? "",
			image: caseStudy?.image.map((img) => ({ url: img })) ?? [],
			video: caseStudy?.video ?? "",
			videoThumbnail: caseStudy?.videoThumbnail ?? "",
			segmentId: segmentID,
			tags: caseStudy?.tags.map((tag) => ({ text: tag })) ?? [],
			order: caseStudy?.order ?? -1,
			published: caseStudy?.published ?? false,
		});
	}

	useEffect(() => {
		if (isOpen) {
			console.log("hit");
			handleReset();
		}
	}, [isOpen, caseStudy]);

	const {
		register,
		handleSubmit,
		setValue,
		control,
		watch,
		reset,
		formState: { isDirty, errors, dirtyFields },
	} = newCaseStudyForm;

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

	const [newTag, setNewTag] = useState("");

	function handleSubmitCaseStudy(data: CaseStudyFromType) {
		if (caseStudy) {
			updateCaseStudy(data, caseStudy.id)
				.then(() => onOpenChange())
				.catch((err) => console.log(err));
		} else {
			createCaseStudy(data)
				.then(() => {
					onOpenChange();
				})
				.catch((err) => console.log(err));
		}
	}

	return (
		<>
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
								<form
									id="case-study-form"
									onSubmit={handleSubmit(
										handleSubmitCaseStudy
									)}
								>
									<div className="grid xl:grid-cols-2 gap-10">
										<div id="left">
											<div className="font-bold text-2xl">
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
											<div className="font-bold text-2xl mt-2">
												Date/Location:
											</div>
											<input
												type="text"
												className="text-black"
												{...register("dateLocation")}
											/>
											<div className="flex justify-between mt-5">
												<div className="font-bold text-2xl mt-auto">
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
											<div className="font-bold text-2xl mt-5">
												New Tag:
											</div>
											<div className="flex gap-4">
												<input
													className="text-black"
													type="text"
													placeholder="Add a new Tag"
													value={newTag}
													onChange={(e) => {
														setNewTag(
															e.target.value
														);
													}}
												/>

												<Button
													type="button"
													onPress={() => {
														if (newTag !== "") {
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
											<div className="font-bold text-2xl mt-5">
												Order:
											</div>
											<div className="w-1/4">
												<input
													className="text-black"
													type="number"
													{...register("order")}
												/>
											</div>
										</div>
									</div>
									<div className="grid xl:grid-cols-2 gap-10">
										<div id="left">
											<div className="min-h-[33%]">
												<div className="font-bold text-2xl pb-2 mb-2 border-b border-neutral-400">
													Images:
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
													<div className="font-bold text-2xl pb-2 mb-2 border-b border-neutral-400">
														Video:
													</div>
													<VideoSelect
														setValueCaseStudy={
															setValue
														}
														currentVideo={
															currentVideo
														}
													/>
												</div>
												<div className="basis-1/2">
													<div className="font-bold text-2xl pb-2 mb-2 border-b border-neutral-400">
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
																alt={
																	videoThumbnail
																}
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
								</form>
							</ModalBody>
							<ModalFooter>
								{caseStudy && (
									<Button
										color="danger"
										variant="light"
										className="rounded-md"
										onPress={() => {
											onOpenChangeDeleteWarning();
										}}
									>
										Delete Case Study
									</Button>
								)}
								<Button
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
										color={published ? "danger" : "success"}
										className="rounded-md"
										onPress={() => {
											updateCaseStudyPublished(
												caseStudy.id,
												!caseStudy.published
											)
												.then(() => {
													onOpenChange();
												})
												.catch((err) =>
													console.log(err)
												);
										}}
									>
										{published ? "Unpublish" : "Publish"}
									</Button>
								)}
								<Button
									type="submit"
									form="case-study-form"
									className="bg-orange-600 text-white rounded-md"
								>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			{caseStudy && (
				<Modal
					size="2xl"
					isDismissable={false}
					hideCloseButton
					backdrop="blur"
					isOpen={isOpenDeleteWarning}
					className="dark"
					scrollBehavior="inside"
					onOpenChange={onOpenChangeDeleteWarning}
				>
					<ModalContent>
						{(onClose) => (
							<>
								<ModalHeader>
									<div className="w-full text-center font-bold text-red-400">
										Are you sure?
									</div>
								</ModalHeader>
								<ModalBody>
									<div className="font-bold text-2xl text-center">
										{"Delete " + caseStudy.title + "?"}
									</div>
								</ModalBody>
								<ModalFooter>
									<Button
										className="rounded-md"
										color="danger"
										variant="light"
										onPress={() => {
											deleteCaseStudy(caseStudy.id)
												.then(() => {
													onClose();
													onOpenChangeDeleteWarning();
													onOpenChange();
												})
												.catch((err) =>
													console.log(err)
												);
										}}
									>
										Delete
									</Button>
									<Button
										className="rounded-md"
										color="danger"
										onPress={() => {
											onClose();
										}}
									>
										Close
									</Button>
								</ModalFooter>
							</>
						)}
					</ModalContent>
				</Modal>
			)}
		</>
	);
}
