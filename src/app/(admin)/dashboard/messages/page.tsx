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
    const messages: Message[] = await prisma.message.findMany({
        orderBy: [
            {
                createdAt: "desc",
            },
            { name: "asc" },
        ],
    });

    return (
        <MessageStateProvider messages={messages}>
            <div className="xl:mx-20 mx-4 fade-in pb-20 xl:pb-0 xl:h-screen flex flex-col">
                <div className="xl:py-10 w-full">
                    <div className="border-b flex gap-10 w-full py-4">
                        <div className="flex gap-4">
                            <div className="text-3xl font-bold capitalize">
                                Messages
                            </div>
                        </div>
                        <div className="mt-auto">
                            <MultipleMessageActions />
                        </div>
                    </div>
                </div>
                <SelectAllButton />
                {/* Desktop */}
                <div className="hidden h-full overflow-hidden xl:flex border-2 border-neutral-800 rounded mb-6">
                    <div className="basis-2/6 overflow-y-scroll dark">
                        {messages.map((message: Message, index: number) => {
                            return (
                                <DesktopMessageCard
                                    key={index}
                                    message={message}
                                />
                            );
                        })}
                    </div>
                    <div className="basis-4/6 p-4">
                        <DesktopViewMessage />
                    </div>
                </div>
                {/* Mobile */}
                <div className="grid xl:hidden xl:grid-cols-4 xl:gap-10 gap-4 xl:mt-0 mt-4">
                    {messages.map((message: Message, index: number) => {
                        return (
                            <MobileMessageCard key={index} message={message} />
                        );
                    })}
                </div>
            </div>
        </MessageStateProvider>
    );
}
