"use server";

//  Prisma
import prisma from "@/lib/prisma";
//  Components
import DashboardMain from "@/components/dashboard/DashboardMain";
//  Types
import { Message, emailHost } from "@prisma/client";

//  Functions
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/authOptions";

export default async function Dashboard() {
    // Function for revalidating the dashboard route as well as the page route that the content relates to

    //  Collect session data
    const session = await getServerSession(authOptions);
    //  Collect all page data including segments and case studies for CMS
    const data = await prisma.page.findMany({
        orderBy: {
            id: "asc",
        },
    });
    const segments = await prisma.segment.findMany({
        orderBy: { order: "asc" },
    });
    const caseStudies = await prisma.caseStudy.findMany({
        orderBy: { id: "asc" },
    });
    const emailHost = await prisma.emailHost.findFirst();
    const messages: Message[] = await prisma.message.findMany({
        orderBy: [
            {
                createdAt: "desc",
            },
            { name: "asc" },
        ],
    });
    const videos = await prisma.videos.findMany();
    const images = await prisma.images.findMany();
    const logos = await prisma.logos.findMany();
    const requests = await prisma.serviceRequest.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            position: true,
            image: true,
            activated: true,
            role: true,
        },
    });
    const activated = await prisma.user.findUnique({
        where: {
            email: session!.user.email!,
        },
        select: {
            activated: true,
        },
    });
    return (
        <>
            {/* Main dashboard panel with all views available */}
            <DashboardMain
                emailHost={emailHost as emailHost}
                messages={messages}
                session={session as Session}
                data={data}
                videos={videos}
                images={images}
                logos={logos}
                requests={requests}
                segments={segments}
                caseStudies={caseStudies}
                users={users}
                activated={activated!.activated}
            />
        </>
    );
}
