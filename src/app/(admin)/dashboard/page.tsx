"use server";

//  Prisma
import prisma from "@/lib/prisma";
//  Components
import DashboardView from "@/components/dashboard/Dashboard";
//  Types
import { Message } from "@prisma/client";
//  Functions
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import ActivationPopup from "@/components/dashboard/modals/ActivationPopup";
import { checkUserActivation } from "@/server/userActions/userActivation";

export default async function Dashboard() {
    //  Collect session data
    const session = await getServerSession(authOptions);

    const activated = await checkUserActivation(session?.user?.id!);

    const messages: Message[] = await prisma.message.findMany({
        orderBy: [
            {
                createdAt: "desc",
            },
            { name: "asc" },
        ],
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
    const logos = await prisma.logos.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    const requests = await prisma.serviceRequest.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <>
            <DashboardView
                hidden={false}
                images={images}
                videos={videos}
                logos={logos}
                messages={messages}
                requests={requests}
            />
            {session && session.user && (
                <ActivationPopup
                    activated={activated.message}
                    userID={session.user.id!}
                />
            )}
        </>
    );
}
