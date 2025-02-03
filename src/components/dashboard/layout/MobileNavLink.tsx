// packages
import { Badge } from "@heroui/react";
import Link from "next/link";

const MobileNavLink = ({
	pathname,
	link,
	page,
	icon,
	text,
	unreadMessages,
}: Readonly<{
	pathname: string;
	link: string;
	page: string;
	icon: string;
	text: string;
	unreadMessages?: number;
}>) => {
	const splitBy = pathname === "/dashboard" ? "/" : "/dashboard/";

	return (
		<Link
			href={"/dashboard" + link}
			className={`mt-auto transition-all text-center text-xs`}
		>
			<i
				aria-hidden
				className={`${
					pathname.split(splitBy)[1].split("/")[0].includes(page)
						? "text-orange-600"
						: "text-white"
				} ${icon} fa-xl`}
			/>
			{page === "messages" && (
				<Badge
					placement="top-right"
					color="danger"
					isInvisible={!unreadMessages || unreadMessages < 1}
					content={unreadMessages}
				>
					<></>
				</Badge>
			)}
			<div className="mt-1 capitalize">{text}</div>
		</Link>
	);
};

export default MobileNavLink;
