"use client";

import { Page } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import Messages from "./Message";
import Settings from "./Settings";
import Pages from "./Pages";
import { NextUIProvider } from "@nextui-org/react";

export default function DashboardMain(props: {
    data: Page;
    revalidateDashboard: any;
}) {
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "none";

    return (
        <NextUIProvider>
            <Messages hidden={view === "messages" ? false : true} />
            <Settings hidden={view === "settings" ? false : true} />
            <Pages
                hidden={view === "pages" ? false : true}
                data={props.data}
                revalidateDashboard={props.revalidateDashboard}
            />
            {/* {props.data.map((page: Page, index: number) => {
                return (
                    <div key={index}>
                        <PageEdit
                            bgVideos={bgVideos}
                            revalidateDashboard={props.revalidateDashboard}
                            data={page}
                            hidden={pageEdit === page.title ? false : true}
                        />
                    </div>
                );
            })} */}
        </NextUIProvider>
    );
}
