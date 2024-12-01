import AddSegmentButtonModal from "@/components/dashboard/pageView/AddSegmentButtonModal";
import HeaderStateProvider from "@/components/dashboard/pageView/HeaderStateProvider";
import HeaderTextareaInput from "@/components/dashboard/pageView/HeaderTextareaInput";
import HeaderTextInput from "@/components/dashboard/pageView/HeaderTextInput";
import MediaFilesProvider from "@/components/dashboard/pageView/MediaFIlesProvider";
import UpdatePageHeaderButton from "@/components/dashboard/pageView/UpdatePageHeaderButton";
import VideoSelect from "@/components/dashboard/pageView/VideoSelect";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page({ params }: { params: { title: string } }) {
    const data = await prisma.page.findUnique({
        where: { title: params.title[0] },
        include: {
            segment: {
                include: {
                    casestudy: true,
                },
            },
        },
    });

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

    if (!data || !videos || !images) return <div>Not Found</div>;

    return (
        <MediaFilesProvider images={images} videos={videos}>
            <div className="xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 xl:h-screen flex flex-col">
                <div className="xl:pt-10 w-full">
                    <div className="border-b flex gap-10 w-full py-4 mb-10">
                        <div className="flex gap-4">
                            <div className="text-3xl font-bold">
                                <Link
                                    className="capitalize hover:text-orange-600 transition-all"
                                    href={"/dashboard/pages"}>
                                    Pages
                                </Link>
                                {" / "}
                                <Link
                                    className="capitalize hover:text-orange-600 transition-all"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={
                                        data.title === "home"
                                            ? "/"
                                            : "/" + data.title
                                    }>
                                    {data.title}
                                    <i
                                        aria-hidden
                                        className={
                                            "ms-2 text-orange-600 fa-solid fa-arrow-up-right-from-square fa-sm"
                                        }
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
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
                                    <VideoSelect formTarget="video1" />
                                    <VideoSelect formTarget="video2" />
                                    <VideoSelect formTarget="backgroundVideo" />
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
                        <AddSegmentButtonModal pageID={data.id} />
                    </div>
                    {/* TODO */}
                    {/* Segment Accordion */}
                </div>
            </div>
        </MediaFilesProvider>
    );
}
