// Prisma
import prisma from "@/lib/prisma";
// Components
import ImageDisplay from "@/components/dashboard/mediaView/ImageDisplay";
import ImageDisplayControls from "@/components/dashboard/mediaView/ImageDisplayControls";
import MediaUploadButtonModal from "@/components/dashboard/mediaView/MediaUploadButtonModal";
import VideoDisplay from "@/components/dashboard/mediaView/VideoDisplay";
import VideoDisplayControls from "@/components/dashboard/mediaView/VideoDisplayControls";
// Provider
import MediaStateProvider from "@/components/dashboard/mediaView/MediaStateProvider";

export default async function MediaPage() {
    const videos = await prisma.videos.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    const images = await prisma.images.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    const logos = await prisma.logos.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

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
                        <VideoDisplayControls />
                        <VideoDisplay />
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between border-b mb-5 xl:mt-0 mt-6">
                            <div className="font-bold text-xl">Images</div>
                        </div>
                        <ImageDisplayControls />
                        <ImageDisplay />
                    </div>
                </div>
            </div>
        </MediaStateProvider>
    );
}
