// Prisma
import prisma from "@/lib/prisma";
// Types

// Functions
import { authOptions } from "@/authOptions";
import { UserWithoutPassword } from "@/lib/types";
import { getServerSession, Session } from "next-auth";
// Components
import EmailHost from "@/components/dashboard/settingsView/EmailHost";
import MobileUserTable from "@/components/dashboard/settingsView/MobileUserTable";
import DesktopUserTable from "@/components/dashboard/settingsView/DesktopUserTable";
import AddUserButtonModal from "@/components/dashboard/settingsView/AddUserButtonModal";

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
        orderBy: { lastname: "asc" },
    });

    return (
        <div className="xl:mx-20 mx-4 fade-in xl:pb-0 pb-20">
            <div className="xl:my-10">
                <div className="border-b py-4 text-3xl font-bold capitalize">
                    Settings
                </div>
                <EmailHost emailHost={emailHost?.emailHost!} />
                <div className="font-bold mt-5 text-xl">All Users</div>
                <AddUserButtonModal />
                <MobileUserTable
                    users={users as UserWithoutPassword[]}
                    session={session as Session}
                />
                <DesktopUserTable
                    users={users as UserWithoutPassword[]}
                    session={session as Session}
                />
            </div>
        </div>
    );
}
