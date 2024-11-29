import { authOptions } from "@/authOptions";
import Media from "@/components/dashboard/Media";
import prisma from "@/lib/prisma";
import { getServerSession, Session } from "next-auth";

export default async function MediaPage() {
    const session = await getServerSession(authOptions);

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
        <Media
            session={session as Session}
            images={images}
            videos={videos}
            logos={logos}
        />
    );
}
