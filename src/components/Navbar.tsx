"use client";

// Next Imports
import Link from "next/link";

// Library Imports
import { CircularProgress } from "@nextui-org/react";

// React Imports
import { useState } from "react";

export default function Navbar(props: { active: string }) {
    const [loading, setLoading] = useState(false);

    function loadWait() {
        setTimeout(() => {
            setLoading(true);
        }, 500);
    }

    return (
        <>
            <nav className="fixed z-40 bg-black bottom-0 xl:bottom-auto xl:border-t-0 border-t border-orange-600 xl:top-0 w-screen">
                <ul className="flex justify-evenly xl:w-4/6 mx-auto uppercase font-bold xl:font-normal xl:py-3 pt-3 pb-4 text-base xl:text-2xl">
                    <li
                        className={`${
                            props.active === "home" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link onClick={loadWait} scroll={false} href={"/"}>
                            Home
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "film" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link onClick={loadWait} scroll={false} href={"/film"}>
                            Film
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "digital" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            onClick={loadWait}
                            scroll={false}
                            href={"/digital"}>
                            Digital
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "light" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link onClick={loadWait} scroll={false} href={"/light"}>
                            Light
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "events" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            onClick={loadWait}
                            scroll={false}
                            href={"/events"}>
                            Events
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "art" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link onClick={loadWait} scroll={false} href={"/art"}>
                            Art
                        </Link>
                    </li>
                </ul>
            </nav>
            <div
                className={`${
                    loading ? "flex" : "hidden"
                } fade-in h-screen w-screen overflow-none absolute top-0 left-0 bg-black bg-opacity-75 z-40 justify-center`}>
                <CircularProgress
                    classNames={{
                        track: "text-orange-600",
                        indicator: "text-orange-600",
                    }}
                    aria-label="Loading..."
                />
            </div>
        </>
    );
}
