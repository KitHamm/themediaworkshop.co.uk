import Messages from "@/components/dashboard/Message";
import prisma from "@/lib/prisma";
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

    return <Messages hidden={false} messages={messages} />;
}
