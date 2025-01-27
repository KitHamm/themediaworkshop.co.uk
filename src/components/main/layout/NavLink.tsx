"use client";
import Link from "next/link";
// packages
import { usePathname } from "next/navigation";

const NavLink = ({ title }: Readonly<{ title: string }>) => {
	const pathname = usePathname();

	let href = "/";
	if (title !== "home") {
		href = "/" + title;
	}

	return (
		<li
			className={`${
				pathname === href ? "text-orange-600" : ""
			} xl:hover:text-orange-600 cursor-pointer xl:transition-all`}
		>
			<Link className="uppercase" scroll={false} href={href}>
				{title}
			</Link>
		</li>
	);
};

export default NavLink;
