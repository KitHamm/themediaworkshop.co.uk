"use client";

// Next Imports
import Link from "next/link";

import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <>
            <nav className="fixed z-40 bg-black bottom-0 lg:bottom-auto lg:border-t-0 border-t border-orange-600 lg:top-0 w-screen">
                <ul className="flex justify-evenly xl:w-4/6 mx-auto uppercase font-bold xl:font-normal xl:py-3 pt-3 pb-4 text-base xl:text-2xl">
                    <li
                        className={`${
                            pathname === "/" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link scroll={false} href={"/"}>
                            Home
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/film" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link scroll={false} href={"/film"}>
                            Film
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/digital" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link scroll={false} href={"/digital"}>
                            Digital
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/light" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link scroll={false} href={"/light"}>
                            Light
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/events" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link scroll={false} href={"/events"}>
                            Events
                        </Link>
                    </li>
                    <li
                        className={`${
                            pathname === "/art" ? "text-orange-600" : ""
                        } xl:hover:text-orange-600 cursor-pointer xl:transition-all`}>
                        <Link scroll={false} href={"/art"}>
                            Art
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}
