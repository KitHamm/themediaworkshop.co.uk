"use client";

// Library Components
import { NextUIProvider } from "@nextui-org/react";

// Components
import DashboardView from "./Dashboard";
import Messages from "./Message";
import Settings from "./Settings";
import Media from "./Media";
import Pages from "./Pages";

// Next Components
import { useSearchParams } from "next/navigation";

// Types
import { Message, Page } from "@prisma/client";

export default function DashboardMain(props: {
    data: Page;
    revalidateDashboard: any;
    session: any;
    messages: Message;
}) {
    // Use search params to display correct view (requires use client)
    // Set hidden state of component base on search params
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";

    return (
        <NextUIProvider>
            <DashboardView hidden={view === "dashboard" ? false : true} />
            {/* Main CMS pages view */}

            <Pages
                hidden={view === "pages" ? false : true}
                data={props.data}
                revalidateDashboard={props.revalidateDashboard}
            />
            {/* Media pool view */}
            <Media
                revalidateDashboard={props.revalidateDashboard}
                hidden={view === "media" ? false : true}
            />
            {/* Messages view */}
            <Messages
                messages={props.messages}
                revalidateDashboard={props.revalidateDashboard}
                hidden={view === "messages" ? false : true}
            />

            {/* Settings view */}
            <Settings
                session={props.session}
                hidden={view === "settings" ? false : true}
            />
        </NextUIProvider>
    );
}
