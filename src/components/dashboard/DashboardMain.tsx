"use client";

import { Page } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import Messages from "./Message";
import Settings from "./Settings";
import PageEdit from "./PageEdit";

export default function DashboardMain(props: {
    data: Page;
    revalidateDashboard: any;
}) {
    const searchParams = useSearchParams();
    const pageEdit: string = searchParams.get("pageEdit")
        ? searchParams.get("pageEdit")!
        : "none";
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "none";

    return (
        <>
            <Messages hidden={view === "messages" ? false : true} />
            <Settings hidden={view === "settings" ? false : true} />
            {props.data.map((page: Page, index: number) => {
                return (
                    <div key={index}>
                        <PageEdit
                            revalidateDashboard={props.revalidateDashboard}
                            data={page}
                            hidden={pageEdit === page.title ? false : true}
                        />
                    </div>
                );
            })}
        </>
    );
}
