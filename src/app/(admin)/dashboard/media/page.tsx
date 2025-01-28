// Prisma
import prisma from "@/lib/prisma";
// Components
import MediaStateProvider from "@/components/dashboard/mediaView/MediaStateProvider";
import ImageDisplay from "@/components/dashboard/mediaView/ImageDisplay";
import MediaUploadButtonModal from "@/components/dashboard/mediaView/MediaUploadButtonModal";
import VideoDisplay from "@/components/dashboard/mediaView/VideoDisplay";
import VideoViewButtons from "@/components/dashboard/mediaView/VideoViewButtons";
import MediaPerPageSelect from "@/components/dashboard/mediaView/MediaPerPageSelect";
import MediaSortBySelect from "@/components/dashboard/mediaView/MediaSortBySelect";
import MediaOrderSelect from "@/components/dashboard/mediaView/MediaOrderSelect";
import MediaPaginationControl from "@/components/dashboard/mediaView/MediaPaginationControl";
import ImageViewButtons from "@/components/dashboard/mediaView/ImageViewButtons";
// types
import { Images, Logos, Videos } from "@prisma/client";

export default async function MediaPage() {
	let videos: Videos[] = [];
	let images: Images[] = [];
	let logos: Logos[] = [];
	try {
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
		logos = await prisma.logos.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
	} catch (error) {
		console.log("Error: ", error);
	}

	return (
		<MediaStateProvider images={images} videos={videos} logos={logos}>
			<div className="xl:mx-20 mx-4 fade-in xl:pb-0 pb-20">
				<div className="xl:my-10 border-b py-4 mb-10 text-3xl font-bold capitalize">
					Media
				</div>
				<MediaUploadButtonModal />
				<div className="xl:flex xl:grid-cols-2 grid-cols-1 xl:gap-10 mt-10">
					<div className="xl:w-full">
						<div className="flex justify-between border-b mb-5">
							<div className="font-bold text-xl">Videos</div>
						</div>
						<div className="grid xl:grid-cols-5 grid-cols-2 gap-4 mb-4 text-center">
							<VideoViewButtons />
						</div>
						<div className="flex justify-evenly gap-12 mt-10 xl:mt-4">
							<MediaPerPageSelect image={false} />
							<MediaSortBySelect image={false} />
							<MediaOrderSelect image={false} />
						</div>
						<div className="flex justify-center my-4">
							<MediaPaginationControl image={false} />
						</div>
						<VideoDisplay />
					</div>
					<div className="w-full">
						<div className="flex justify-between border-b mb-5 xl:mt-0 mt-6">
							<div className="font-bold text-xl">Images</div>
						</div>
						<div className="grid xl:grid-cols-5 grid-cols-2 gap-4 mb-4 text-center">
							<ImageViewButtons />
						</div>
						<div className="flex justify-evenly gap-12 mt-10 xl:mt-4">
							<MediaPerPageSelect image />
							<MediaSortBySelect image />
							<MediaOrderSelect image />
						</div>
						<div className="flex justify-center my-4">
							<MediaPaginationControl image />
						</div>
						<ImageDisplay />
					</div>
				</div>
			</div>
		</MediaStateProvider>
	);
}
