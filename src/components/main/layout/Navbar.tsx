// prisma
import prisma from "@/lib/prisma";
import { Page } from "@prisma/client";
import NavLink from "./NavLink";

const Navbar = async () => {
	let links: Pick<Page, "title">[] = [];

	try {
		links = await prisma.page.findMany({
			select: {
				title: true,
			},
			orderBy: {
				id: "asc",
			},
		});
	} catch (error) {
		console.log("Unexpected error:", error);
	}

	return (
		<nav className="fixed z-40 bg-black bottom-0 lg:bottom-auto lg:border-t-0 border-t border-orange-600 lg:top-0 w-screen">
			<ul className="flex justify-evenly xl:w-4/6 mx-auto uppercase font-bold xl:font-normal xl:py-3 pt-3 pb-4 text-base xl:text-2xl">
				{links.map((link) => (
					<NavLink key={link.title} title={link.title} />
				))}
			</ul>
		</nav>
	);
};

export default Navbar;
