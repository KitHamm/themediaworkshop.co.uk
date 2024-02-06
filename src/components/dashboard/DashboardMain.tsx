"use client";

// Library Components
import { useSearchParams } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";

// Components
import Messages from "./Message";
import Settings from "./Settings";
import Media from "./Media";
import Pages from "./Pages";

// Types
import { Page } from "@prisma/client";

export default function DashboardMain(props: {
    data: Page;
    revalidateDashboard: any;
    session: any;
}) {
    // Use search params to display correct view (requires use client)
    // Set hidden state of component base on search params
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "none";

    return (
        <NextUIProvider>
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
            <Messages hidden={view === "messages" ? false : true} />

            {/* Settings view */}
            <Settings
                session={props.session}
                hidden={view === "settings" ? false : true}
            />
        </NextUIProvider>
    );
}
