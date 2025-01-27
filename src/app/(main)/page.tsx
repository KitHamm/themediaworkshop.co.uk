// Prisma
import prisma from "@/lib/prisma";
// packages
import { redirect } from "next/navigation";
import Image from "next/image";
// Components
import BackgroundVideo from "@/components/main/BackgroundVideo";
import TickerTape from "@/components/main/TickerTape";
import ContactButton from "@/components/main/ContactButton";
import VideoButton from "@/components/main/VideoButton";
import HeaderCopy from "@/components/main/HeaderCopy";
import ScrollChevrons from "@/components/main/ScrollChevrons";
import ParallaxImage from "@/components/main/ParallaxImage";
import SegmentText from "@/components/main/SegmentText";
import SegmentImage from "@/components/main/SegmentImage";
import NotFound from "@/components/main/NotFound";
import DataError from "@/components/main/shared/DataError";
// Types
import { ExtendedSegment } from "@/lib/types";
import { ExtendedPage } from "@/lib/types/pageTypes";
import { Logos } from "@prisma/client";

export default async function Page({ slug }: Readonly<{ slug?: string }>) {
	let data: ExtendedPage | null = null;
	let logoImages: Logos[] = [];
	try {
		data = await prisma.page.findUnique({
			where: {
				title: slug ?? "home",
			},
			include: {
				segment: {
					where: { published: true },
					orderBy: { order: "asc" },
					include: {
						casestudy: {
							where: { published: true },
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		logoImages = await prisma.logos.findMany({
			orderBy: { name: "asc" },
		});
	} catch (error) {
		// TODO add data error
		return <DataError />;
	}

	if (!data) {
		if (slug) {
			return redirect("/");
		}
		return <NotFound />;
	}

	return (
		<>
			<header id="header" className="w-full h-full">
				<section
					id="bg-video-container"
					className="relative top-0 left-0 w-full h-screen overflow-hidden"
				>
					<BackgroundVideo backgroundVideo={data.backgroundVideo} />
					<div className="bg-black bg-opacity-30 xl:bg-opacity-0 flex absolute top-0 left-0 z-20 xl:grid xl:grid-cols-2 h-full w-full">
						<div className="m-auto xl:m-0 flex w-full xl:w-auto justify-center">
							<div className="m-auto text-center w-full xl:w-2/3">
								<div className="text-2xl xl:text-md uppercase">
									{data.subTitle}
								</div>

								{!slug ? (
									<Image
										src={"/images/tmw-logo.png"}
										alt="TMW Logo"
										priority
										id="title-logo"
										height={75}
										width={720}
										className="w-11/12 xl:w-3/4 h-auto mx-auto mt-2"
									/>
								) : (
									<h1 className="font-bold text-4xl uppercase">
										{data.header}
									</h1>
								)}
								<div className="block grid xl:grid-cols-3 xl:flex xl:justify-evenly grid-cols-1 gap-4 xl:gap-2 xl:px-10 my-10 xl:my-4">
									{data.video1 && (
										<VideoButton
											buttonText={
												data.videoOneButtonText ||
												"SHOWREEL"
											}
											videoURL={data.video1}
										/>
									)}
									{data.video2 && (
										<VideoButton
											buttonText={
												data.videoOneButtonText ||
												"YEAR REVIEW"
											}
											videoURL={data.video2}
										/>
									)}
									<ContactButton />
								</div>
								{data.description && (
									<HeaderCopy
										description={data.description}
									/>
								)}
							</div>
						</div>
						<ScrollChevrons />
					</div>
				</section>
			</header>

			{logoImages.length > 0 && (
				<div className="my-8">
					<TickerTape start={true} logoImages={logoImages} />
				</div>
			)}

			{data.segment.map((segment: ExtendedSegment, index: number) => {
				return (
					<div key={segment.title}>
						<ParallaxImage headerImage={segment.headerimage} />
						<div className="grid grid-cols-1 xl:grid-cols-2 w-full px-10 xl:px-60 py-10">
							<SegmentText
								index={index}
								linkTo={segment.linkTo}
								title={segment.title}
								copy={segment.copy}
								buttonText={segment.buttonText}
								caseStudies={segment.casestudy}
							/>
							<SegmentImage
								index={index}
								images={segment.image}
							/>
						</div>
					</div>
				);
			})}

			{logoImages.length > 0 && (
				<TickerTape start={false} logoImages={logoImages} />
			)}
		</>
	);
}
