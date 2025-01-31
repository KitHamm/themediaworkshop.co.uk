// prisma
import prisma from "@/lib/prisma";
// packages
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect } from "next/navigation";
// components
import EmailHost from "@/components/dashboard/settingsView/EmailHost";
import MobileUserTable from "@/components/dashboard/settingsView/MobileUserTable";
import DesktopUserTable from "@/components/dashboard/settingsView/DesktopUserTable";
import AddUserButtonModal from "@/components/dashboard/settingsView/AddUserButtonModal";
// types
import { emailHost } from "@prisma/client";
import { UserWithoutPassword } from "@/lib/types";

export default async function SettingsPage() {
	const session = await getServerSession(authOptions);
	let emailHost: emailHost | null = null;
	let users: UserWithoutPassword[] = [];
	let currentUser: UserWithoutPassword | null = null;
	try {
		emailHost = await prisma.emailHost.findFirst();
		users = await prisma.user.findMany({
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
		currentUser = await prisma.user.findUnique({
			where: {
				id: session?.user?.id as string,
			},
		});
	} catch (error) {
		console.log("Unexpected error:", error);
		redirect("/");
	}

	if (!currentUser) {
		return signOut({ callbackUrl: "/" });
	}

	return (
		<div className="xl:mx-20 mx-4 fade-in xl:pb-0 pb-20">
			<div className="xl:my-10">
				<div className="border-b py-4 text-3xl font-bold capitalize">
					Settings
				</div>
				<EmailHost emailHost={emailHost?.emailHost} />
				<div className="font-bold mt-5 text-xl">All Users</div>
				<AddUserButtonModal />
				<DesktopUserTable users={users} currentUser={currentUser} />
				<MobileUserTable users={users} currentUser={currentUser} />
			</div>
		</div>
	);
}
