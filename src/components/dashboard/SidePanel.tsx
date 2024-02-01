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
        <div className="min-h-screen h-full bg-neutral-800 border-r border-orange-400">
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
            <div
                onClick={() => setPagesMenuOpen(!pagesMenuOpen)}
                className="hover:bg-orange-400 cursor-pointer font-bold text-2xl p-5">
                Pages
            </div>
            <div
                id="pages-menu"
                className="overflow-hidden"
                style={{
                    height: pagesMenuOpen
                        ? document.getElementById("pages-menu")?.scrollHeight +
                          "px"
                        : "0px",
                }}>
                <Link
                    href={"?pageEdit=home"}
                    className={` ${
                        pageEdit === "home" ? "bg-neutral-700" : ""
                    } xl:flex text-lg px-10 py-1 hover:bg-orange-400 cursor-pointer`}>
                    Home
                </Link>
                <Link
                    href={"?pageEdit=film"}
                    className={` ${
                        pageEdit === "film" ? "bg-neutral-700" : ""
                    } xl:flex text-lg px-10 py-1 hover:bg-orange-400 cursor-pointer`}>
                    Film
                </Link>
                <Link
                    href={"?pageEdit=digital"}
                    className={` ${
                        pageEdit === "digital" ? "bg-neutral-700" : ""
                    } xl:flex text-lg px-10 py-1 hover:bg-orange-400 cursor-pointer`}>
                    Digital
                </Link>
                <Link
                    href={"?pageEdit=light"}
                    className={` ${
                        pageEdit === "light" ? "bg-neutral-700" : ""
                    } xl:flex text-lg px-10 py-1 hover:bg-orange-400 cursor-pointer`}>
                    Light
                </Link>
                <Link
                    href={"?pageEdit=art"}
                    className={` ${
                        pageEdit === "art" ? "bg-neutral-700" : ""
                    } xl:flex text-lg px-10 py-1 hover:bg-orange-400 cursor-pointer`}>
                    Art
                </Link>
                <Link
                    href={"?pageEdit=events"}
                    className={` ${
                        pageEdit === "events" ? "bg-neutral-700" : ""
                    } xl:flex text-lg px-10 py-1 hover:bg-orange-400 cursor-pointer`}>
                    Events
                </Link>
            </div>
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
