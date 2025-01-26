"use client";

import { Badge } from "@heroui/react";
import Link from "next/link";

export default function MobileNavLink(props: {
    pathname: string;
    link: string;
    page: string;
    icon: string;
    text: string;
    unreadMessages?: number;
}) {
    const { pathname, link, page, icon, text, unreadMessages } = props;
    const splitBy = pathname === "/dashboard" ? "/" : "/dashboard/";

    return (
        <Link
            href={"/dashboard" + link}
            className={`mt-auto transition-all text-center text-xs`}>
            <i
                aria-hidden
                className={`${
                    pathname.split(splitBy)[1].split("/")[0].includes(page)
                        ? "text-orange-600"
                        : "text-white"
                } ${icon} fa-xl`}
            />
            {page === "messages" && (
                <Badge
                    placement="top-right"
                    color="danger"
                    isInvisible={
                        unreadMessages
                            ? unreadMessages < 1
                                ? true
                                : false
                            : true
                    }
                    content={unreadMessages}>
                    {""}
                </Badge>
            )}
            <div className="mt-1 capitalize">{text}</div>
        </Link>
    );
}
