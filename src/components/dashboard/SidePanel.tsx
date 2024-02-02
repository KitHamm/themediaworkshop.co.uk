"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SidePanel(props: { session: any }) {
    const [pagesMenuOpen, setPagesMenuOpen] = useState(false);
    const searchParams = useSearchParams();
    const pageEdit: string = searchParams.get("pageEdit")
        ? searchParams.get("pageEdit")!
        : "none";
    return (
        <div className="min-h-screen h-full fixed top-0 w-1/6 bg-neutral-800 border-r border-orange-400">
            <div className="xl:flex xl:p-10">
                <Image
                    onClick={() => (window.location.href = "/")}
                    src={"/images/tmw-logo.png"}
                    alt="TMW Logo"
                    height={75}
                    width={720}
                    className="cursor-pointer"
                />
            </div>
            <div className="xl:flex justify-center">
                <Image
                    src={
                        props.session.image
                            ? props.session.user.image
                            : "/images/profile_placeholder.jpg"
                    }
                    alt="Profile"
                    height={100}
                    width={100}
                    className="rounded-full"
                    priority
                />
            </div>
            <div className="xl:flex justify-center font-bold xl:text-2xl mt-5">
                {props.session.user.name}
            </div>
            <div className="xl:flex justify-center pb-5 border-b border-neutral-400 text-neutral-400 xl:text-lg">
                {props.session.user.position}
            </div>
            <Link
                href={"?view=pages"}
                className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl p-5">
                Pages
            </Link>
            <Link
                href={"?view=media"}
                className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl p-5">
                Media
            </Link>
            <Link
                href={"?view=messages"}
                className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl p-5">
                Message
            </Link>
            <Link
                href={"?view=settings"}
                className="flex hover:bg-orange-400 cursor-pointer font-bold text-2xl p-5">
                Settings
            </Link>
        </div>
    );
}
