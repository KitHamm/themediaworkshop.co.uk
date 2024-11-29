import { authOptions } from "@/authOptions";
import prisma from "@/lib/prisma";
import { UserWithoutPassword } from "@/lib/types";
import { getServerSession, Session } from "next-auth";
import Settings from "@/components/dashboard/Settings";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const emailHost = await prisma.emailHost.findFirst();
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

    return (
        <Settings
            emailHost={emailHost?.emailHost!}
            session={session as Session}
            users={users as UserWithoutPassword[]}
            hidden={false}
        />
    );
}
