import { Badge } from "@nextui-org/react";
import Link from "next/link";

export default function DesktopNavLink(props: {
    pathname: string;
    link: string;
    page: string;
    icon: string;
    unreadMessages?: number;
}) {
    const { pathname, link, page, icon, unreadMessages } = props;
    const splitBy = pathname === "/dashboard" ? "/" : "/dashboard/";

    return (
        <Link
            href={"/dashboard" + link}
            className={`${
                pathname.split(splitBy)[1].split("/")[0] === page
                    ? "bg-orange-600 border-l-5 border-white"
                    : ""
            } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
            {page === "messages" ? (
                <Badge
                    isInvisible={
                        unreadMessages
                            ? unreadMessages < 1
                                ? true
                                : false
                            : true
                    }
                    content={unreadMessages}
                    color="danger">
                    <i aria-hidden className={`${icon} fa-xl my-auto`} />
                </Badge>
            ) : (
                <i aria-hidden className={`${icon} fa-xl my-auto`} />
            )}
            <div className="my-auto capitalize">{page}</div>
        </Link>
    );
}
