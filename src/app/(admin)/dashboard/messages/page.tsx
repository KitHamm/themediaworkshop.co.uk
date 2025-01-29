// Prisma
import prisma from "@/lib/prisma";
// Components
import DesktopMessageCard from "@/components/dashboard/messagesView/DesktopMessageCard";
import DesktopViewMessage from "@/components/dashboard/messagesView/DesktopViewMessage";
import MessageStateProvider from "@/components/dashboard/messagesView/MessageStateProvider";
import MobileMessageCard from "@/components/dashboard/messagesView/MobileMessageCard";
import MultipleMessageActions from "@/components/dashboard/messagesView/MultipleMessageActions";
import SelectAllButton from "@/components/dashboard/messagesView/SelectAllButton";
// Types
import { Message } from "@prisma/client";

export default async function MessagesPage() {
	let messages: Message[] = [];
	try {
		messages = await prisma.message.findMany({
			orderBy: [
				{
					createdAt: "desc",
				},
				{ name: "asc" },
			],
		});
	} catch (error) {
		console.log("Unexpected error:", error);
	}

	return (
		<MessageStateProvider messages={messages}>
			<div className="xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 xl:h-screen flex flex-col">
				<div className="xl:my-10 py-4 w-full border-b flex gap-10 my-4 items-end">
					<div className="text-3xl font-bold capitalize">
						Messages
					</div>
					<MultipleMessageActions />
				</div>
				<SelectAllButton />
				{/* Desktop */}
				<div className="hidden h-full overflow-hidden xl:flex border-2 border-neutral-800 rounded mb-6">
					<div className="basis-2/6 overflow-y-scroll dark">
						{messages.map((message: Message) => (
							<DesktopMessageCard
								key={message.id}
								message={message}
							/>
						))}
					</div>
					<div className="basis-4/6 p-4">
						<DesktopViewMessage />
					</div>
				</div>
				{/* Mobile */}
				<div className="grid xl:hidden xl:grid-cols-4 xl:gap-10 gap-4 xl:mt-0 mt-4">
					{messages.map((message: Message) => (
						<MobileMessageCard key={message.id} message={message} />
					))}
				</div>
			</div>
		</MessageStateProvider>
	);
}
