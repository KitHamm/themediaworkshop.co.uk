"use client";

import Link from "next/link";

export default function Navbar(props: { active: string }) {
    return (
        <nav className="fixed z-40 bg-black bottom-0 xl:bottom-auto xl:border-t-0 border-t border-orange-600 xl:top-0 w-screen">
            <ul className="flex justify-evenly xl:w-4/6 mx-auto uppercase font-bold xl:font-normal xl:py-3 pt-3 pb-4 text-base xl:text-2xl">
                <li
                    className={`${
                        props.active === "home" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer xl:transition-all`}>
                    <Link
                        // onClick={() =>
                        //     window.scrollTo({
                        //         left: 0,
                        //         top: 0,
                        //         behavior: "smooth",
                        //     })
                        // }
                        scroll={false}
                        href={"/"}>
                        Home
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "film" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer xl:transition-all`}>
                    <Link
                        // onClick={() =>
                        //     window.scrollTo({
                        //         left: 0,
                        //         top: 0,
                        //         behavior: "smooth",
                        //     })
                        // }
                        scroll={false}
                        href={"/film"}>
                        Film
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "digital" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer xl:transition-all`}>
                    <Link
                        // onClick={() =>
                        //     window.scrollTo({
                        //         left: 0,
                        //         top: 0,
                        //         behavior: "smooth",
                        //     })
                        // }
                        scroll={false}
                        href={"/digital"}>
                        Digital
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "light" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer xl:transition-all`}>
                    <Link
                        // onClick={() =>
                        //     window.scrollTo({
                        //         left: 0,
                        //         top: 0,
                        //         behavior: "smooth",
                        //     })
                        // }
                        scroll={false}
                        href={"/light"}>
                        Light
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "events" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer xl:transition-all`}>
                    <Link
                        // onClick={() =>
                        //     window.scrollTo({
                        //         left: 0,
                        //         top: 0,
                        //         behavior: "smooth",
                        //     })
                        // }
                        scroll={false}
                        href={"/events"}>
                        Events
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "art" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer xl:transition-all`}>
                    <Link
                        // onClick={() =>
                        //     window.scrollTo({
                        //         left: 0,
                        //         top: 0,
                        //         behavior: "smooth",
                        //     })
                        // }
                        scroll={false}
                        href={"/art"}>
                        Art
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
