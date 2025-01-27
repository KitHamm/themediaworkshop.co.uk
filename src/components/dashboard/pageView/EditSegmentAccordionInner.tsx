"use client";

import { ExtendedSegment, ImageFormType, SegmentFormType } from "@/lib/types";
import { CaseStudy, toLink } from "@prisma/client";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import SegmentTopImageInput from "./SegmentTopImageInput";
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
import DescriptionInput from "./DescriptionInput";
import Image from "next/image";
import AddImageArray from "./AddImageArray";
import {
	updateSegment,
	updateSegmentPublish,
} from "@/server/segmentActions/updateSegment";
import { deleteSegment } from "@/server/segmentActions/deleteSegment";
import CaseStudyModal from "./CaseStudyModal";

export default function EditSegmentAccordionInner(props: {
	segment: ExtendedSegment;
}) {
	const { segment } = props;

	const [segmentDeleteError, setSegmentDeleteError] =
		useState<boolean>(false);

	const [publishedCaseStudies, setPublishedCaseStudies] = useState<
		CaseStudy[]
	>(segment.casestudy.filter((cs) => cs.published));
	const [draftCaseStudies, setDraftCaseStudies] = useState<CaseStudy[]>(
		segment.casestudy.filter((cs) => !cs.published)
	);

	const [selectedCaseStudy, setSelectedCaseStudy] = useState<
		CaseStudy | undefined
	>();

	const {
		isOpen: isOpenDeleteWarning,
		onOpenChange: onOpenChangeDeleteWarning,
	} = useDisclosure();
	const { isOpen: isOpenCaseStudy, onOpenChange: onOpenChangeCaseStudy } =
		useDisclosure();

	useEffect(() => {
		setPublishedCaseStudies(segment.casestudy.filter((cs) => cs.published));
		setDraftCaseStudies(segment.casestudy.filter((cs) => !cs.published));
	}, [segment.casestudy]);

	const segmentForm = useForm<SegmentFormType>();
	const {
		register,
		handleSubmit,
		reset,
		setValue,
		getValues,
		control,
		watch,
		formState: { isDirty, errors },
	} = segmentForm;

	const {
		fields: imageFields,
		append: imageAppend,
		remove: imageRemove,
	} = useFieldArray({
		control: control,
		name: "image",
	});

	const headerImage = watch("headerImage");
	const copy = watch("copy");

	useEffect(() => {
		handleReset();
	}, [segment]);

	function handleDeleteSegment() {
		deleteSegment(props.segment.id)
			.then(() => {
				setSegmentDeleteError(false);
				onOpenChangeDeleteWarning();
			})
			.catch((err) => {
				setSegmentDeleteError(true);
				console.log(err.message);
			});
	}

	function handleUpdate(data: SegmentFormType) {
		updateSegment(data).catch((err) => console.log(err));
	}

	function handleReset() {
		const images: ImageFormType[] = [];

		for (let i = 0; i < props.segment.image.length; i++) {
			images.push({ url: props.segment.image[i] });
		}

		reset({
			id: props.segment.id,
			title: props.segment.title ? props.segment.title : "",
			copy: props.segment.copy ? props.segment.copy : "",
			image: images,
			video: [],
			headerImage: props.segment.headerimage
				? props.segment.headerimage
				: "",
			order: props.segment.order ? props.segment.order : -1,
			buttonText: props.segment.buttonText
				? props.segment.buttonText
				: "",
			linkTo: props.segment.linkTo ? props.segment.linkTo : toLink.NONE,
		});
	}

	return (
		<>
			<div className="light rounded-md xl:px-5 mb-4 py-4">
				<form onSubmit={handleSubmit(handleUpdate)}>
					<div className="flex justify-between border-b pb-2">
						<div className="text-orange-600 font-bold mt-auto text-xl">
							Top Image
						</div>
						<div className="flex gap-6">
							{isDirty && (
								<div className="fade-in text-red-400 font-bold text-xl my-auto">
									Unsaved Changes
								</div>
							)}
							<Button
								type="button"
								color="danger"
								variant="light"
								onPress={onOpenChangeDeleteWarning}
								className="text-md rounded-md"
							>
								Delete Segment
							</Button>
							<Button
								type="button"
								color="warning"
								variant="light"
								onPress={handleReset}
								className="text-md rounded-md"
							>
								Reset
							</Button>
							<Button
								type="submit"
								disabled={!isDirty}
								className="disabled:bg-neutral-600 bg-orange-600 text-white text-md rounded-md"
							>
								Save Changes
							</Button>
							<Button
								type="button"
								onPress={() =>
									updateSegmentPublish(
										segment.id,
										!segment.published
									).catch((err) => console.log(err))
								}
								color={segment.published ? "danger" : "success"}
								className="text-white text-md rounded-md"
							>
								{segment.published ? "Unpublish" : "Publish"}
							</Button>
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
											message: "Title is required.",
										},
									})}
									placeholder={
										errors.title
											? errors.title.message
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
											e.target.value as toLink,
											{ shouldDirty: true }
										)
									}
									selectedKeys={[getValues("linkTo")]}
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
								<div className="w-full">
									<div className="text-orange-600 font-bold text-xl border-b pb-2 mb-2">
										Custom Button Text
									</div>
									<input
										className="text-black"
										{...register("buttonText")}
										type="text"
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
													key={image + "-" + index}
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
										imageAppendSegment={imageAppend}
									/>
								</div>
							</div>
							<div className="flex gap-4 border-b mt-6 bg">
								<div className="py-4 text-orange-600 my-auto font-bold text-xl">
									Case Studies
								</div>
								<Button
									type="button"
									onPress={() => {
										setSelectedCaseStudy(undefined);
										onOpenChangeCaseStudy();
									}}
									className="my-auto rounded-md text-white text-md bg-orange-600"
								>
									Add Case Study
								</Button>
							</div>
							{/* TODO Published case studies */}
							{publishedCaseStudies.length > 0 && (
								<>
									<div className="text-green-600 font-bold text-lg my-4">
										PUBLISHED
									</div>
									<div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-black xl:mt-2 rounded-lg px-2 min-h-10">
										{publishedCaseStudies.map(
											(
												caseStudy: CaseStudy,
												index: number
											) => {
												return (
													<Button
														type="button"
														onPress={() => {
															setSelectedCaseStudy(
																caseStudy
															);
															onOpenChangeCaseStudy();
														}}
														key={
															caseStudy.title +
															"-" +
															index
														}
														color="success"
														className="rounded-md text-white text-md"
													>
														{caseStudy.title}
													</Button>
												);
											}
										)}
									</div>
								</>
							)}
							{/* TODO Draft case studies */}
							{draftCaseStudies.length > 0 && (
								<>
									<div className="text-red-400 font-bold text-lg my-4">
										DRAFTS
									</div>
									<div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-black xl:mt-2 rounded-lg px-2 min-h-10">
										{draftCaseStudies.map(
											(
												caseStudy: CaseStudy,
												index: number
											) => {
												return (
													<Button
														type="button"
														onPress={() => {
															setSelectedCaseStudy(
																caseStudy
															);
															onOpenChangeCaseStudy();
														}}
														key={
															caseStudy.title +
															"-" +
															index
														}
														color="danger"
														className="rounded-md text-white text-md"
													>
														{caseStudy.title}
													</Button>
												);
											}
										)}
									</div>
								</>
							)}
						</div>
					</div>
				</form>
			</div>
			<Modal
				size="2xl"
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
								{segmentDeleteError ? (
									<div>
										<div className="font-bold text-2xl text-center text-red-400">
											Unable to delete.
										</div>
										<div className="font-bold text-base text-center">
											Segment may have Case Studies.
											Please delete them first.
										</div>
									</div>
								) : (
									<div className="font-bold text-2xl text-center">
										{"Delete " + props.segment.title + "?"}
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								{!segmentDeleteError && (
									<Button
										type="button"
										color="danger"
										variant="light"
										onPress={() => {
											handleDeleteSegment();
										}}
									>
										Delete
									</Button>
								)}
								<Button
									type="button"
									color="danger"
									onPress={() => {
										onClose();
										setSegmentDeleteError(false);
									}}
								>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<CaseStudyModal
				segmentID={segment.id}
				isOpen={isOpenCaseStudy}
				onOpenChange={onOpenChangeCaseStudy}
				caseStudy={selectedCaseStudy}
			/>
		</>
	);
}
