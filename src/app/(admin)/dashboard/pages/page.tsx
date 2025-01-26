import prisma from "@/lib/prisma";
import { Divider } from "@heroui/react";
import Link from "next/link";

type PageTitleSegmentTitles = {
    title: string;
    segment:
        | {
              title: string | null;
          }[]
        | null;
};

export default async function PagesMain() {
    const data: PageTitleSegmentTitles[] = await prisma.page.findMany({
        orderBy: {
            id: "asc",
        },
        select: {
            title: true,
            segment: {
                select: {
                    title: true,
                },
            },
        },
    });

    if (!data) return <div>Not Found</div>;

    return (
        <>
            <div className="xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 xl:h-screen flex flex-col">
                <div className="xl:py-10 w-full">
                    <div className="border-b flex gap-10 w-full py-4 mb-10">
                        <div className="flex gap-4">
                            <div className="text-3xl font-bold capitalize">
                                Pages
                            </div>
                        </div>
                    </div>
                    {data.map((page: PageTitleSegmentTitles, index: number) => {
                        return (
                            <div
                                className="xl:w-1/2 bg-neutral-800 mb-4 p-4 rounded-md"
                                key={index}>
                                <div className="flex justify-between">
                                    <div className="flex gap-8">
                                        <div className="capitalize text-2xl mt-auto font-bold text-orange-600">
                                            {page.title}
                                        </div>
                                        <div className="mt-auto text-lg">
                                            Segments: {page.segment?.length}
                                        </div>
                                    </div>
                                    <div className="flex gap-8">
                                        <Link
                                            href={`/dashboard/pages/${page.title}`}
                                            className="text-lg mt-auto hover:text-orange-600 transition-all">
                                            Edit
                                        </Link>
                                        <Link
                                            target="_blank"
                                            rel="noreferrer"
                                            href={`/${
                                                page.title === "home"
                                                    ? ""
                                                    : page.title
                                            }`}
                                            className="text-lg mt-auto hover:text-orange-600 transition-all">
                                            View
                                        </Link>
                                    </div>
                                </div>
                                <Divider className="bg-white mt-2" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
