"use client";

// Next Imports
import Link from "next/link";

// Library Imports
import { CircularProgress } from "@nextui-org/react";

// React Imports
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar(props: { active: string }) {
    // const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    // useEffect(() => {
    //     document.body.style.overflowY = "auto";
    // }, []);

    // function loadWait(target: string) {
    //     if (props.active !== target) {
    //         setTimeout(() => {
    //             setLoading(true);
    //             // document.body.style.overflow = "hidden";
    //         }, 1000);
    //     }
    // }

    return (
        <>
            <nav className="fixed z-40 bg-black bottom-0 lg:bottom-auto lg:border-t-0 border-t border-orange-600 lg:top-0 w-screen">
                <ul className="flex justify-evenly xl:w-4/6 mx-auto uppercase font-bold xl:font-normal xl:py-3 pt-3 pb-4 text-base xl:text-2xl">
                    <li
                        className={`${
                            pathname === "/" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            // onClick={() => loadWait("home")}
                            scroll={false}
                            href={"/"}>
                            Home
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/film" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            // onClick={() => loadWait("film")}
                            scroll={false}
                            href={"/film"}>
                            Film
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/digital" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            // onClick={() => loadWait("digital")}
                            scroll={false}
                            href={"/digital"}>
                            Digital
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/light" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            // onClick={() => loadWait("light")}
                            scroll={false}
                            href={"/light"}>
                            Light
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/events" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            // onClick={() => loadWait("events")}
                            scroll={false}
                            href={"/events"}>
                            Events
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/art" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link
                            // onClick={() => loadWait("art")}
                            scroll={false}
                            href={"/art"}>
                            Art
                        </Link>
                    </li>
                </ul>
            </nav>
            {/* <div
                className={`${
                    loading ? "flex" : "hidden"
                } fade-in h-screen w-screen overflow-none fixed top-0 left-0 bg-black bg-opacity-75 z-40 justify-center`}>
                <CircularProgress
                    classNames={{
                        track: "text-orange-600",
                        indicator: "text-orange-600",
                    }}
                    aria-label="Loading..."
                />
            </div> */}
        </>
    );
}
