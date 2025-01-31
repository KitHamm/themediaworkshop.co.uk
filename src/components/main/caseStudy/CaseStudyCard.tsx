// packages
import { Chip, useDisclosure } from "@heroui/react";
import Image from "next/image";
import { useRef } from "react";
import Markdown from "react-markdown";
// components
import { EmblaCarouselCaseStudyInner } from "@/Embla/EmblaCarousel";
import ViewCSImagesModal from "./ViewCSImagesModal";
import ViewCSVideoModal from "./ViewCSVideoModal";
// types
import { CaseStudy } from "@prisma/client";

const CaseStudyCard = ({
	caseStudy,
	index,
}: Readonly<{ caseStudy: CaseStudy; index: number }>) => {
	const copyText = useRef<HTMLDivElement | null>(null);
	const left: boolean = index % 2 === 0;

	const { isOpen: isOpenViewImages, onOpenChange: onOpenChangeViewImages } =
		useDisclosure();
	const { isOpen: isOpenViewVideo, onOpenChange: onOpenChangeViewVideo } =
		useDisclosure();

	return (
		<div
			key={caseStudy.title + "_" + index}
			className={`py-8 ${
				index !== 0 ? "border-t border-neutral-600" : ""
			} `}
		>
			<div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
				<div
					id={left ? "left" : "right"}
					className={`px-5 pb-5 ${
						left ? "order-first" : "order-first xl:order-last"
					}`}
				>
					<div className="w-full pb-2 mb-2 border-b text-2xl font-bold text-orange-600">
						{caseStudy.title}
					</div>
					<div className="mb-2">{caseStudy.dateLocation}</div>
					<div ref={copyText} className="copy-text w-full text-lg">
						<Markdown>{caseStudy.copy}</Markdown>
					</div>
					<div className="flex flex-wrap gap-2 mt-5">
						{caseStudy.tags.map((tag: string, index: number) => {
							return <Chip key={tag + "-" + index}>{tag}</Chip>;
						})}
					</div>
				</div>
				<div id="media" className="xl:mt-10">
					<div id="images" className="my-auto carousel-embla">
						{caseStudy.image.length > 0 ? (
							caseStudy.image.length > 1 ? (
								<div onClick={onOpenChangeViewImages}>
									<EmblaCarouselCaseStudyInner
										slides={caseStudy.image}
									/>
								</div>
							) : (
								<Image
									onClick={onOpenChangeViewImages}
									width={900}
									height={500}
									src={
										process.env.NEXT_PUBLIC_CDN! +
										"/images/" +
										caseStudy.image[0]
									}
									alt={caseStudy.image[0]}
									className="w-full h-auto cursor-pointer"
								/>
							)
						) : (
							""
						)}
						{caseStudy.video && (
							<div className="relative">
								<video
									playsInline
									disablePictureInPicture
									id="bg-video"
									className="h-auto w-full fade-in mt-2"
									autoPlay={false}
									muted
									loop
									src={
										process.env.NEXT_PUBLIC_CDN! +
										"/videos/" +
										caseStudy.video
									}
								/>
								{caseStudy.videoThumbnail && (
									<div
										onClick={onOpenChangeViewVideo}
										className="absolute z-10 bottom-0 w-full h-full flex cursor-pointer"
									>
										<Image
											src={
												process.env.NEXT_PUBLIC_CDN +
												"/images/" +
												caseStudy.videoThumbnail
											}
											alt="thumbnail"
											width={500}
											height={300}
											className="h-full w-auto m-auto"
										/>
									</div>
								)}
								<div
									onClick={onOpenChangeViewVideo}
									className="transition-all absolute z-20 bg-black hover:bg-opacity-25 bg-opacity-50 bottom-0 w-full h-full flex cursor-pointer"
								>
									<Image
										src={"/images/play.png"}
										alt="play"
										width={500}
										height={300}
										className="transition-all h-1/2 w-auto m-auto hover:opacity-100 opacity-85"
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<ViewCSImagesModal
				isOpen={isOpenViewImages}
				onOpenChange={onOpenChangeViewImages}
				images={caseStudy.image}
			/>
			{caseStudy.video && (
				<ViewCSVideoModal
					isOpen={isOpenViewVideo}
					onOpenChange={onOpenChangeViewVideo}
					videoURL={caseStudy.video}
				/>
			)}
		</div>
	);
};

export default CaseStudyCard;
