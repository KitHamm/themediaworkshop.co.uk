"use client";

// Library Components
import {
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    useDisclosure,
    Badge,
    User,
    Button,
} from "@nextui-org/react";

//  React Components
import { useEffect, useState } from "react";

// Next Auth
import { signOut } from "next-auth/react";

// Next Components
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

//  Functions
import { Message, Tickets } from "@prisma/client";
import CreateTicketModal from "./modals/CreateTicketModal";
import ViewTicketsModal from "./modals/ViewTicketsModal";
import UploadAvatarModal from "./modals/uploadAvatarModal";
import DesktopNavLink from "./DesktopNavLink";
import MobileNavLink from "./MobileNavLink";
import { countUnreadMessages } from "@/lib/functions";
import { updateDatabase } from "@/server/devFunctions/updateDatabase";

export default function SidePanel(props: {
    session: any;
    messages: Message[];
    tickets: Tickets[];
    avatar: string | undefined;
}) {
    const pathname = usePathname();
    // Search params for which view is active

    // Modal states
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [unreadMessages, setUnreadMessages] = useState<number>(
        countUnreadMessages(props.messages)
    );

    useEffect(() => {
        setUnreadMessages(countUnreadMessages(props.messages));
    }, [props.messages]);

    const {
        isOpen: isOpenReport,
        onOpen: onOpenReport,
        onOpenChange: onOpenChangeReport,
    } = useDisclosure();
    const {
        isOpen: isOpenTickets,
        onOpen: onOpenTickets,
        onOpenChange: onOpenChangeTickets,
    } = useDisclosure();

    return (
        <>
            {/* Mobile Navigation Bar */}
            <div className="z-40 fixed w-screen bottom-0 left-0 xl:hidden bg-neutral-800 border-t border-orange-600">
                <div className="flex justify-evenly pb-2 pt-2">
                    <Dropdown placement="top-start" className="dark z-0">
                        <DropdownTrigger>
                            <Avatar
                                showFallback
                                name={
                                    Array.from(
                                        props.session.user.name
                                    )[0] as string
                                }
                                src={
                                    props.avatar !== undefined
                                        ? process.env.NEXT_PUBLIC_CDN +
                                          "/avatars/" +
                                          props.avatar
                                        : undefined
                                }
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownSection showDivider>
                                <DropdownItem
                                    textValue="Edit Profile"
                                    key="edit-profile">
                                    <a
                                        href={
                                            "dashboard?view=settings&open=true"
                                        }>
                                        Edit Profile
                                    </a>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => onOpen()}
                                    key="new-avatar">
                                    Change Avatar
                                </DropdownItem>
                            </DropdownSection>
                            {props.session.user.name === "Kit Hamm" ? (
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={() => onOpenTickets()}
                                        key="view-tickets">
                                        View Tickets
                                    </DropdownItem>
                                </DropdownSection>
                            ) : (
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={() => onOpenReport()}
                                        key="report-problem">
                                        Report Problem
                                    </DropdownItem>
                                </DropdownSection>
                            )}
                            <DropdownSection>
                                <DropdownItem
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                    key="logout"
                                    className="text-red-400">
                                    Log Out
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                    <MobileNavLink
                        pathname={pathname}
                        link=""
                        page="dashboard"
                        text="Dash"
                        icon="fa-solid fa-house"
                    />
                    <MobileNavLink
                        pathname={pathname}
                        link="/pages"
                        page="pages"
                        text="Pages"
                        icon="fa-regular fa-window-restore"
                    />
                    <MobileNavLink
                        pathname={pathname}
                        link="/media"
                        page="media"
                        text="Media"
                        icon="fa-regular fa-images"
                    />
                    <MobileNavLink
                        pathname={pathname}
                        link="/messages"
                        page="messages"
                        text="Msg"
                        icon="fa-regular fa-message"
                        unreadMessages={unreadMessages}
                    />
                    <MobileNavLink
                        pathname={pathname}
                        link="/settings"
                        page="settings"
                        text="Settings"
                        icon="fa-solid fa-gear"
                    />
                </div>
            </div>
            {/* Desktop Side Panel */}
            {/* Side panel set to 1/6 width of the screen in a fixed position on the left */}
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
                {/* User information and avatar */}
                <div className="xl:flex pb-5 border-b border-neutral-400 mb-20">
                    <div className="px-5 w-full flex justify-between">
                        <User
                            name={
                                <div className="font-bold text-xl">
                                    {props.session.user.name}
                                </div>
                            }
                            description={
                                <div className="text-md">
                                    {props.session.user.position}
                                </div>
                            }
                            avatarProps={{
                                src:
                                    props.avatar !== undefined
                                        ? process.env.NEXT_PUBLIC_CDN +
                                          "/avatars/" +
                                          props.avatar
                                        : undefined,
                                name: Array.from(
                                    props.session.user.name
                                )[0] as string,
                                size: "lg",
                                className: "text-large ms-auto",
                            }}
                        />
                        {/* User dropdown containing upload new avatar and logout */}
                        <Dropdown className="dark z-0">
                            <DropdownTrigger>
                                <div className="xl:basis-1/5 xl:flex xl:cursor-pointer">
                                    <i
                                        aria-hidden
                                        className="xl:m-auto fa-solid fa-ellipsis-vertical"></i>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        textValue="Edit Profile"
                                        key="edit-profile">
                                        <a
                                            href={
                                                "dashboard?view=settings&open=true"
                                            }>
                                            Edit Profile
                                        </a>
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => onOpen()}
                                        key="new-avatar">
                                        Change Avatar
                                    </DropdownItem>
                                </DropdownSection>
                                {props.session.user.name === "Kit Hamm" ? (
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            onClick={() => onOpenTickets()}
                                            key="view-tickets">
                                            View Tickets
                                        </DropdownItem>
                                    </DropdownSection>
                                ) : (
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            onClick={() => onOpenReport()}
                                            key="report-problem">
                                            Report Problem
                                        </DropdownItem>
                                    </DropdownSection>
                                )}
                                <DropdownSection>
                                    <DropdownItem
                                        onClick={() =>
                                            signOut({ callbackUrl: "/" })
                                        }
                                        key="logout"
                                        className="text-red-400">
                                        Log Out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                {/* Navigation Links using state props */}
                <DesktopNavLink
                    pathname={pathname}
                    page="dashboard"
                    link=""
                    icon="fa-solid fa-house"
                />
                <DesktopNavLink
                    pathname={pathname}
                    page="pages"
                    link="/pages"
                    icon="fa-regular fa-window-restore"
                />
                <DesktopNavLink
                    pathname={pathname}
                    page="media"
                    link="/media"
                    icon="fa-regular fa-images"
                />
                <DesktopNavLink
                    pathname={pathname}
                    page="messages"
                    link="/messages"
                    icon="fa-regular fa-message"
                    unreadMessages={unreadMessages}
                />
                <DesktopNavLink
                    pathname={pathname}
                    page="settings"
                    link="/settings"
                    icon="fa-solid fa-gear"
                />
                {/* <Button onClick={() => updateDatabase()}>DB Update</Button> */}
            </div>
            {/* Report a Problem Modal */}
            <CreateTicketModal
                onOpenChangeReport={onOpenChangeReport}
                isOpenReport={isOpenReport}
                name={props.session.user.name}
            />

            {/* Tickets Modal */}
            <ViewTicketsModal
                tickets={props.tickets}
                onOpenChangeTickets={onOpenChangeTickets}
                isOpenTickets={isOpenTickets}
            />

            {/* Modal for uploading new avatar */}
            <UploadAvatarModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                userId={props.session.user.id}
                userName={Array.from(props.session.user.name)[0] as string}
            />
        </>
    );
}
