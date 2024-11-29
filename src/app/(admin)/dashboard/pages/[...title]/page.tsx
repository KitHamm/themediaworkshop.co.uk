import PageEdit from "@/components/dashboard/Pages/PageEdit";
import NotificationProvider from "@/components/dashboard/providers/NotificationProvider";
import prisma from "@/lib/prisma";

export default async function Page({ params }: { params: { title: string } }) {
    const data = await prisma.page.findUnique({
        where: { title: params.title[0] },
    });

    const segments = await prisma.segment.findMany({
        orderBy: { order: "asc" },
    });

    const caseStudies = await prisma.caseStudy.findMany({
        orderBy: { id: "asc" },
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

    return (
        <NotificationProvider>
            <PageEdit
                data={data!}
                segments={segments}
                caseStudies={caseStudies}
                videos={videos}
                images={images}
                hidden={false}
            />
        </NotificationProvider>
    );
}
