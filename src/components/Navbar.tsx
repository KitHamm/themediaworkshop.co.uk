"use client";

import Link from "next/link";

export default function Navbar(props: { active: string }) {
    return (
        <>
            <nav className="hidden xl:block fixed z-40 bg-black top-0 w-full">
                <ul className="flex justify-evenly w-4/6 mx-auto uppercase font-normal py-3 text-2xl">
                    <li
                        className={`${
                            props.active === "home" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/"}>
                            Home
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "film" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/film"}>
                            Film
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "digital" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/digital"}>
                            Digital
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "light" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/light"}>
                            Light
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "events" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/events"}>
                            Events
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "art" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/art"}>
                            Art
                        </Link>
                    </li>
                </ul>
            </nav>
            <nav className="xl:hidden block fixed z-40 bg-neutral-900 border-t border-orange-400 bottom-0 w-full">
                <ul className="flex justify-evenly w-full uppercase font-bold py-4 text-md">
                    <li
                        className={`${
                            props.active === "home" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/"}>
                            Home
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "film" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/film"}>
                            Film
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "digital" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/digital"}>
                            Digital
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "light" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/light"}>
                            Light
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "events" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/events"}>
                            Events
                        </Link>
                    </li>
                    <li
                        className={`${
                            props.active === "art" ? "text-orange-600" : ""
                        } hover:text-orange-600 cursor-pointer`}>
                        <Link
                            onClick={() =>
                                window.scrollTo({
                                    left: 0,
                                    top: 0,
                                    behavior: "smooth",
                                })
                            }
                            scroll={false}
                            href={"/art"}>
                            Art
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}
