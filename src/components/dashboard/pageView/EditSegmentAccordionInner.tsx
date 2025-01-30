"use client";
// packages
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import Image from "next/image";
// functions
import {
	updateSegment,
	updateSegmentPublish,
} from "@/server/segmentActions/updateSegment";
// components
import SegmentTopImageInput from "./segments/SegmentTopImageInput";
import DescriptionInput from "./DescriptionInput";
import AddImageArray from "./shared/AddImageArray";
import TitleInput from "./segments/TitleInput";
import LinkToSelect from "./segments/LinkToSelect";
import OrderInput from "./segments/OrderInput";
// types
import { ExtendedSegment, ImageFormType, SegmentFormType } from "@/lib/types";
import { CaseStudy, toLink } from "@prisma/client";
import CaseStudyModal from "./caseStudy/CaseStudyModal";

const SegmentEdit = ({
	segment,
	pageTitles,
}: Readonly<{
	segment: ExtendedSegment;
	pageTitles: { title: string }[];
}>) => {
	const [publishedCaseStudies, setPublishedCaseStudies] = useState<
		CaseStudy[]
	>(segment.casestudy.filter((cs) => cs.published));
	const [draftCaseStudies, setDraftCaseStudies] = useState<CaseStudy[]>(
		segment.casestudy.filter((cs) => !cs.published)
	);

	useEffect(() => {
		setPublishedCaseStudies(segment.casestudy.filter((cs) => cs.published));
		setDraftCaseStudies(segment.casestudy.filter((cs) => !cs.published));
	}, [segment.casestudy]);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		control,
		watch,
		formState: { isDirty, errors },
	} = useForm<SegmentFormType>();

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
	const linkToValue = watch("linkTo");

	useEffect(() => {
		handleReset();
	}, [segment]);

	const onSubmit = async (data: SegmentFormType) => {
		try {
			const res = await updateSegment(data);
			if (!res.success) {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const handleReset = () => {
		const images = segment.image.map((img) => ({ url: img }));
		reset({
			id: segment.id,
			title: segment.title ?? "",
			copy: segment.copy ?? "",
			image: images,
			video: [],
			headerImage: segment.headerimage ?? "",
			order: segment.order ?? -1,
			buttonText: segment.buttonText ?? "",
			linkTo: segment.linkTo ?? toLink.NONE,
		});
	};

	return (
		<div className="light rounded-md xl:px-5 mb-4 py-4">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex justify-between border-b pb-2">
					<div className="text-orange-600 font-bold mt-auto text-xl">
						Top Image
					</div>
					<div className="flex gap-6 mb-2">
						{isDirty && (
							<div className="fade-in text-red-400 font-bold text-xl my-auto">
								Unsaved Changes
							</div>
						)}
						<Button
							type="button"
							color="danger"
							variant="light"
							onPress={() => {}}
							className="text-md rounded-md"
						>
							Delete Segment
						</Button>
						{isDirty && (
							<>
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
							</>
						)}
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
						<TitleInput
							target="title"
							label="Title"
							register={register}
							errors={errors}
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
							<div className="xl:w-1/3 w-1/2">
								<OrderInput
									target="order"
									register={register}
									label="Order"
									required
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
									(image: ImageFormType, index: number) => {
										return (
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
							<CaseStudyModal segmentId={segment.id} />
							{/* <Button
								type="button"
								onPress={() => {}}
								className="my-auto rounded-md text-white text-md bg-orange-600"
							>
								Add Case Study
							</Button> */}
						</div>
						{publishedCaseStudies.length > 0 && (
							<>
								<div className="text-green-600 font-bold text-lg my-4">
									PUBLISHED
								</div>
								<div className="flex flex-wrap xl:gap-4 py-2 xl:py-3 gap-2 bg-black xl:mt-2 rounded-lg px-2 min-h-10">
									{publishedCaseStudies.map(
										(caseStudy: CaseStudy) => {
											return (
												<CaseStudyModal
													key={caseStudy.id}
													caseStudy={caseStudy}
													segmentId={segment.id}
												/>
											);
										}
									)}
								</div>
							</>
						)}
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
												<CaseStudyModal
													key={caseStudy.id}
													caseStudy={caseStudy}
													segmentId={segment.id}
												/>
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
	);
};

export default SegmentEdit;
