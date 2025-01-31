"use client";
// packages
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	User,
	useDisclosure,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
// constants
import { navLinks } from "@/lib/constants";
// functions
import countUnreadMessages from "@/lib/utils/messageUtils/countUnreadMessages";
// components
import DesktopNavLink from "./DesktopNavLink";
import ChangeAvatarModal from "./ChangeAvatarModal";
import ViewTicketsModal from "./ViewTicketsModal";
import CreateTicketModal from "./CreateTicketModal";
// types
import { Message, Tickets, User as UserType } from "@prisma/client";

const DesktopSideBar = ({
	messages,
	tickets,
	user,
}: Readonly<{
	messages: Message[];
	tickets: Tickets[];
	user: UserType;
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
		<div className="hidden xl:block min-h-screen h-full fixed top-0 w-1/6 bg-neutral-800 border-r border-orange-600">
			<div className="xl:flex xl:p-10 border-b border-neutral-400 mb-4">
				<Link target="_blank" href="/">
					<Image
						src={"/images/tmw-logo.png"}
						alt="TMW Logo"
						priority
						id="title-logo"
						height={75}
						width={720}
						className="cursor-pointer max-w-full"
					/>
				</Link>
			</div>
			<div className="xl:flex pb-5 border-b border-neutral-400 mb-20">
				<div className="px-5 w-full flex justify-between">
					<User
						name={
							<div className="font-bold text-xl">{userName}</div>
						}
						description={
							<div className="text-md">{user.position}</div>
						}
						avatarProps={{
							src: avatar,
							name: userName,
							size: "lg",
							className: "text-large ms-auto",
						}}
					/>
					<Dropdown className="dark z-0">
						<DropdownTrigger>
							<div className="xl:basis-1/5 xl:flex xl:cursor-pointer">
								<i
									aria-hidden
									className="xl:m-auto fa-solid fa-ellipsis-vertical"
								></i>
							</div>
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
										onPress={() => onOpenChangeTickets()}
										key="view-tickets"
									>
										View Tickets
									</DropdownItem>
								</DropdownSection>
							) : (
								<DropdownSection showDivider>
									<DropdownItem
										onPress={() => onOpenChangeReport()}
										key="report-problem"
									>
										Report Problem
									</DropdownItem>
								</DropdownSection>
							)}
							<DropdownSection>
								<DropdownItem
									onPress={() =>
										signOut({ callbackUrl: "/" })
									}
									key="logout"
									className="text-red-400"
								>
									Log Out
								</DropdownItem>
							</DropdownSection>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
			{navLinks.map((link) => (
				<DesktopNavLink
					key={link.page}
					pathname={pathname}
					page={link.page}
					link={link.link}
					icon={link.icon}
					unreadMessages={unreadMessages}
				/>
			))}
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

export default DesktopSideBar;
