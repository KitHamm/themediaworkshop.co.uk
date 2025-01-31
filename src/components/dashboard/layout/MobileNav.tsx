"use client";
// packages
import {
	Avatar,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	useDisclosure,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
// constants
import { navLinks } from "@/lib/constants";
// functions
import countUnreadMessages from "@/lib/utils/messageUtils/countUnreadMessages";
// components
import MobileNavLink from "./MobileNavLink";
import ChangeAvatarModal from "./ChangeAvatarModal";
import ViewTicketsModal from "./ViewTicketsModal";
import CreateTicketModal from "./CreateTicketModal";
// types
import { Message, Tickets, User } from "@prisma/client";

const MobileNav = ({
	messages,
	tickets,
	user,
}: Readonly<{
	messages: Message[];
	tickets: Tickets[];
	user: User;
}>) => {
	const pathname = usePathname();
	const [unreadMessages, setUnreadMessages] = useState<number>(
		countUnreadMessages(messages)
	);

	const { isOpen: isOpenAvatar, onOpenChange: onOpenChangeAvatar } =
		useDisclosure();
	const { isOpen: isOpenTickets, onOpenChange: onOpenChangeTickets } =
		useDisclosure();
	const { isOpen: isOpenReport, onOpenChange: onOpenChangeReport } =
		useDisclosure();

	const userName = `${user.firstname} ${user.lastname}`;
	const avatar = user.image
		? `${process.env.NEXT_PUBLIC_CDN}/avatars/${user.image}`
		: undefined;

	useEffect(() => {
		setUnreadMessages(countUnreadMessages(messages));
	}, [messages]);

	return (
		<div className="z-40 fixed w-screen bottom-0 left-0 xl:hidden bg-neutral-800 border-t border-orange-600">
			<div className="flex justify-evenly pb-2 pt-2">
				<Dropdown placement="top-start" className="dark z-0">
					<DropdownTrigger>
						<Avatar showFallback name={userName} src={avatar} />
					</DropdownTrigger>
					<DropdownMenu aria-label="Static Actions">
						<DropdownSection showDivider>
							<DropdownItem
								textValue="Edit Profile"
								key="edit-profile"
							>
								<Link href={"/dashboard/settings"}>
									Edit Profile
								</Link>
							</DropdownItem>
							<DropdownItem
								onPress={onOpenChangeAvatar}
								key="new-avatar"
							>
								Change Avatar
							</DropdownItem>
						</DropdownSection>
						{userName === "Kit Hamm" ? (
							<DropdownSection showDivider>
								<DropdownItem
									onPress={onOpenChangeTickets}
									key="view-tickets"
								>
									View Tickets
								</DropdownItem>
							</DropdownSection>
						) : (
							<DropdownSection showDivider>
								<DropdownItem
									onPress={onOpenChangeReport}
									key="report-problem"
								>
									Report Problem
								</DropdownItem>
							</DropdownSection>
						)}
						<DropdownSection>
							<DropdownItem
								onPress={() => signOut({ callbackUrl: "/" })}
								key="logout"
								className="text-red-400"
							>
								Log Out
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
				{navLinks.map((link) => (
					<MobileNavLink
						key={link.link}
						pathname={pathname}
						link={link.link}
						page={link.page}
						text={link.text}
						icon={link.icon}
						unreadMessages={unreadMessages}
					/>
				))}
			</div>
			<ChangeAvatarModal
				isOpen={isOpenAvatar}
				onOpenChange={onOpenChangeAvatar}
				userId={user.id}
			/>
			<ViewTicketsModal
				tickets={tickets}
				isOpen={isOpenTickets}
				onOpenChange={onOpenChangeTickets}
			/>
			<CreateTicketModal
				isOpen={isOpenReport}
				onOpenChange={onOpenChangeReport}
				userName={userName}
			/>
		</div>
	);
};

export default MobileNav;
