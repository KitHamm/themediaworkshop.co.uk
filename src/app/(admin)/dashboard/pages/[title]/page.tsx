// prisma
import prisma from "@/lib/prisma";
// components
import AddSegmentButtonModal from "@/components/dashboard/pageView/segments/segmentModal/AddSegmentButtonModal";
import HeaderTextareaInput from "@/components/dashboard/pageView/mainView/HeaderTextareaInput";
import HeaderTextInput from "@/components/dashboard/pageView/mainView/HeaderTextInput";
import SegmentAccordion from "@/components/dashboard/pageView/segments/SegmentAccordion";
import UpdatePageHeaderButton from "@/components/dashboard/pageView/mainView/UpdatePageHeaderButton";
import VideoSelect from "@/components/dashboard/shared/VideoSelect";
// providers
import HeaderStateProvider from "@/components/dashboard/pageView/mainView/HeaderStateProvider";
import MediaFilesProvider from "@/components/dashboard/pageView/shared/MediaFIlesProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { ExtendedPage, ExtendedSegment } from "@/lib/types";
import { redirect } from "next/navigation";
import { Images, User, Videos } from "@prisma/client";
import { signOut } from "next-auth/react";
import BreadcrumbLinks from "@/components/dashboard/pageView/mainView/Breadcrumbs";

import { Fragment } from "react";
import SegmentEdit from "@/components/dashboard/pageView/segments/EditSegmentAccordionInner";
import SegmentAccordionTitle from "@/components/dashboard/pageView/segments/SegmentAccordionTitle";
export default async function Page({
	params,
}: Readonly<{ params: Promise<{ title: string }> }>) {
	const { title } = await params;
	const session = await getServerSession(authOptions);

	let data: ExtendedPage | null = null;
	let videos: Videos[] = [];
	let images: Images[] = [];
	let user: User | null = null;
	let pageTitles: { title: string }[] = [];
	try {
		data = await prisma.page.findUnique({
			where: { title: title },
			include: {
				segment: {
					orderBy: { order: "asc" },
					include: {
						casestudy: {
							orderBy: { order: "asc" },
						},
					},
				},
			},
		});
		videos = await prisma.videos.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		images = await prisma.images.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		user = await prisma.user.findUnique({
			where: {
				id: session?.user?.id as string,
			},
		});
		pageTitles = await prisma.page.findMany({
			select: {
				title: true,
			},
			orderBy: {
				id: "asc",
			},
		});
	} catch (error) {
		redirect("/dashboard/pages");
	}

	if (!data) redirect("/dashboard/pages");

	if (!user) {
		return signOut({ callbackUrl: "/" });
	}

	return (
		<MediaFilesProvider images={images} videos={videos} currentUser={user}>
			<div className="xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 flex flex-col">
				<div className="xl:pt-14 w-full border-b flex gap-10 w-full pb-4 mb-10 text-3xl font-bold">
					<BreadcrumbLinks page={data.title} />
				</div>
				<HeaderStateProvider data={data}>
					<div className="w-full">
						<div className="w-full flex justify-between border-b py-4 mb-10">
							<div className="text-2xl text-orange-600 font-bold mt-auto">
								Header Content
							</div>
							<UpdatePageHeaderButton />
						</div>
						<div className="xl:grid xl:grid-cols-2 xl:gap-10">
							<div id="left-column">
								<div className="border-b pb-2 mb-4">
									Page Videos
								</div>
								<div className="grid xl:grid-cols-3 grid-cols-2 grid-cols-1 gap-4 xl:gap-10 min-h-20 xl:mb-0 mb-4">
									<VideoSelect target="video1" />
									<VideoSelect target="video2" />
									<VideoSelect target="backgroundVideo" />
								</div>
								<div className="grid grid-cols-2 gap-8 mt-8">
									<HeaderTextInput
										label="Left Video Button Text"
										placeholder="SHOWREEL"
										formTarget="videoOneButtonText"
									/>
									<HeaderTextInput
										label="Middle Video Button Text"
										placeholder="YEAR REVIEW"
										formTarget="videoTwoButtonText"
									/>
								</div>
							</div>
							<div id="right-column">
								<div className="flex flex-col gap-4">
									{data.title !== "home" && (
										<HeaderTextInput
											label="Header"
											placeholder="Title"
											formTarget="header"
										/>
									)}
									<HeaderTextInput
										label="Prefix Title"
										placeholder="Sub Title"
										formTarget="subTitle"
									/>
									<HeaderTextareaInput />
								</div>
							</div>
						</div>
					</div>
				</HeaderStateProvider>
				<div id="segments">
					<div className="flex gap-5 border-b pb-2 mt-10 mb-2">
						<div className="my-auto text-orange-600 font-bold text-2xl">
							Segments
						</div>
						<AddSegmentButtonModal
							pageId={data.id}
							pageTitles={pageTitles}
						/>
					</div>
					<SegmentAccordion>
						{data.segment.map((segment: ExtendedSegment, index) => (
							<Fragment key={segment.id}>
								<SegmentAccordionTitle
									segment={segment}
									index={index}
								/>
								<div className="px-4">
									<SegmentEdit
										segment={segment}
										pageTitles={pageTitles}
									/>
								</div>
							</Fragment>
						))}
					</SegmentAccordion>
				</div>
			</div>
		</MediaFilesProvider>
	);
}
