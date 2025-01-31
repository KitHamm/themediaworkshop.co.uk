// prisma
import prisma from "@/lib/prisma";
// packages
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
// components
import InfoAccordion from "@/components/dashboard/mainView/InfoAccordion";
import ChangeLogAccordion from "@/components/dashboard/mainView/ChangeLogAccordion";
import PageViewTracker from "@/components/dashboard/mainView/PageViewTracker";
import ActivationPopup from "@/components/dashboard/modals/ActivationPopup";
// functions
import { checkUserActivation } from "@/server/userActions/userActivation";
// types
import { serviceRequest, User } from "@prisma/client";
import { signOut } from "next-auth/react";

export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	let user: User | null = null;
	let activated: boolean = true;
	let requests: serviceRequest[] = [];

	try {
		user = await prisma.user.findUnique({
			where: {
				id: session?.user?.id as string,
			},
		});

		if (!user) {
			return signOut({ callbackUrl: "/" });
		}
		requests = await prisma.serviceRequest.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		const activatedRes = await checkUserActivation(user.id);
		if (activatedRes.success) {
			activated = activatedRes.activated;
		}
	} catch (error) {
		console.log("Unexpected error:", error);
	}

	if (!user) {
		return signOut({ callbackUrl: "/" });
	}

	return (
		<div className="xl:mx-20 mx-4 pb-20 xl:pb-0 fade-in">
			<div className="grid xl:mb-10 xl:grid-cols-2 grid-cols-1 xl:gap-10">
				<div id="left">
					<div className="border-b py-4 text-3xl xl:my-10 my-5 font-bold capitalize">
						Change Log
					</div>
					<ChangeLogAccordion />
				</div>
				<div id="right">
					<div className="border-b py-4 text-3xl xl:my-10 my-5 font-bold capitalize">
						Information
					</div>
					<PageViewTracker requests={requests} />
					<InfoAccordion />
				</div>
			</div>
			<ActivationPopup activated={activated} userId={user.id} />
		</div>
	);
}
