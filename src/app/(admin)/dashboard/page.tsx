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

export default async function Dashboard() {
	//  Collect session data
	const session = await getServerSession(authOptions);

	const activated = await checkUserActivation(session?.user?.id!);

	const requests = await prisma.serviceRequest.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<>
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
			</div>
			{session && session.user && (
				<ActivationPopup
					activated={activated.message}
					userID={session.user.id!}
				/>
			)}
		</>
	);
}
