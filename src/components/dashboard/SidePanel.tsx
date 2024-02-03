"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@nextui-org/react";
import prisma from "@/lib/prisma";
import { useEffect, useState } from "react";

export default function SidePanel(props: { session: any }) {
    const [avatar, setAvatar] = useState("");
    useEffect(() => {
        getAvatar();
    }, []);

    async function getAvatar() {
        fetch("/api/avatar", {
            method: "POST",
            body: JSON.stringify({
                id: props.session.user.id,
            }),
        })
            .then((res) => res.json())
            .then((json) => setAvatar(json.avatar))
            .catch((err) => console.log(err));
    }

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
            <div className="xl:flex pb-5 border-b border-neutral-400">
                <div className="px-5">
                    <Avatar
                        showFallback
                        src={avatar ? "./avatars/" + avatar : undefined}
                        name={props.session.user.name}
                        size="lg"
                        className="text-large ms-auto"
                    />
                </div>
                <div className="w-full flex">
                    <div className="my-auto">
                        <div className=" font-bold xl:text-xl">
                            {props.session.user.name}
                        </div>
                        <div className="text-neutral-400 xl:text-md">
                            {props.session.user.position}
                        </div>
                    </div>
                </div>
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
