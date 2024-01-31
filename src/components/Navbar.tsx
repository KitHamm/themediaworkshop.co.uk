import Link from "next/link";

export default function Navbar(props: { active: string }) {
    return (
        <nav className="fixed z-40 bg-neutral-900 top-0 w-full">
            <ul className="flex justify-evenly px-80 uppercase font-normal py-3 text-2xl">
                <li
                    className={`${
                        props.active === "home" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer`}>
                    <Link scroll={false} href={"/"}>
                        Home
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "film" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer`}>
                    <Link scroll={false} href={"/film"}>
                        Film
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "digital" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer`}>
                    <Link scroll={false} href={"/digital"}>
                        Digital
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "light" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer`}>
                    <Link scroll={false} href={"/light"}>
                        Light
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "events" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer`}>
                    <Link scroll={false} href={"/events"}>
                        Events
                    </Link>
                </li>
                <li
                    className={`${
                        props.active === "art" ? "text-orange-600" : ""
                    } hover:text-orange-600 cursor-pointer`}>
                    <Link scroll={false} href={"/art"}>
                        Art
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
